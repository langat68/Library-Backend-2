import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { prometheus } from '@hono/prometheus'

import { booksRouter} from './Books/books.router'

import { authorsRouter} from './autho/authors.router'
// import { stateRouter } from './state/state.router'
// import { statusCatalogRouter } from './statusCatalog/statusCatalog.router'
// import { restaurantOwnerRouter } from './restaurant_owner/restaurantOwner.router'
// import { restaurantRouter } from './restaurant/restaurant.router'
// import { ordersRouter } from './orders/orders.router'
// import { orderStatusRouter } from './order_status/orderStatus.router'
// import { orderMenuItemRouter } from './order_menu_item/orderMenuItem.router'
// import { menuItemRouter } from './menu_item/menuItem.router'
// import { driverRouter } from './driver/driver.router'
// import { commentRouter } from './comment/comment.router'
// import { cityRouter } from './city/city.router'
// import { categoryRouter } from './category/category.router'
// import { addressRouter } from './address/address.router'
// import { authRouter } from './auth/auth.router'



const app = new Hono()

const customTimeoutException = () =>
  new HTTPException(408, {
    message: `Request timeout `,
  })

const { printMetrics, registerMetrics } = prometheus()

// inbuilt middlewares
app.use(logger())  //logs request and response to the console
app.use(csrf()) //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()) //removes trailing slashes from the request URL
app.use('/', timeout(10000, customTimeoutException))
//3rd party middlewares
app.use('*', registerMetrics)


// default route
app.get('/ok', (c) => {
  return c.text('The server is running!')
})
app.get('/timeout', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000))
  return c.text("data after 5 seconds", 200)
})
app.get('/metrics', printMetrics)

// custom route
app.route("/", booksRouter)   // books
app.route("/", authorsRouter)
// app.route("/", statusCatalogRouter)   // /statusCatalog
// app.route("/", stateRouter)   // /state
// app.route("/", restaurantOwnerRouter)   // /restaurantOwner
// app.route("/", restaurantRouter)   // /restaurant
// app.route("/", ordersRouter)   // /orders
// app.route("/", orderStatusRouter)   // /orderstatus
// app.route("/", orderMenuItemRouter)   // /orderMenuItem
// app.route("/", menuItemRouter)   // /menuItem
// app.route("/", driverRouter)   // /driver
// app.route("/", commentRouter)   // /comment
// app.route("/", cityRouter)   // /city
// app.route("/", categoryRouter)   // /category
// app.route("/",addressRouter)   // /address
// app.route("/",authRouter) 


// render message
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Menu</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
            color: #333;
        }
        header {
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
            text-align: center;
        }
        nav {
            display: flex;
            justify-content: center;
            background-color: #333;
        }
        nav a {
            padding: 14px 20px;
            display: block;
            color: white;
            text-align: center;
            text-decoration: none;
        }
        nav a:hover {
            background-color: #ddd;
            color: black;
        }
        .container {
            padding: 20px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        .section table {
            width: 100%;
            border-collapse: collapse;
        }
        .section table, .section th, .section td {
            border: 1px solid #ddd;
        }
        .section th, .section td {
            padding: 8px;
            text-align: left;
        }
        .section th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <header>
        <h1>Kipsang Restaurant</h1>
    </header>
    <nav>
        <a href="#orders">Orders</a>
        <a href="#state">State</a>
        <a href="#address">Address</a>
        <a href="#drivers">Drivers</a>
        <a href="#owners">Restaurant Owners</a>
        <a href="#status">Status Catalog</a>
    </nav>
    <div class="container">
        <div id="orders" class="section">
            <h2>Orders</h2>
            <table>
                <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
                <tr>
                    <td>001</td>
                    <td>John Doe</td>
                    <td>Pizza</td>
                    <td>2</td>
                    <td>$20</td>
                </tr>
                <tr>
                    <td>002</td>
                    <td>Jane Smith</td>
                    <td>Burger</td>
                    <td>1</td>
                    <td>$8</td>
                </tr>
            </table>
        </div>
        <div id="state" class="section">
            <h2>State</h2>
            <table>
                <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>001</td>
                    <td>Delivered</td>
                </tr>
                <tr>
                    <td>002</td>
                    <td>Preparing</td>
                </tr>
            </table>
        </div>
        <div id="address" class="section">
            <h2>Address</h2>
            <table>
                <tr>
                    <th>Order ID</th>
                    <th>Address</th>
                </tr>
                <tr>
                    <td>001</td>
                    <td>123 Main St</td>
                </tr>
                <tr>
                    <td>002</td>
                    <td>456 Elm St</td>
                </tr>
            </table>
        </div>
        <div id="drivers" class="section">
            <h2>Drivers</h2>
            <table>
                <tr>
                    <th>Driver ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                </tr>
                <tr>
                    <td>D001</td>
                    <td>Tom Lee</td>
                    <td>(555) 123-4567</td>
                </tr>
                <tr>
                    <td>D002</td>
                    <td>Lisa Ray</td>
                    <td>(555) 765-4321</td>
                </tr>
            </table>
        </div>
        <div id="owners" class="section">
            <h2>Restaurant Owners</h2>
            <table>
                <tr>
                    <th>Owner ID</th>
                    <th>Name</th>
                    <th>Restaurant</th>
                </tr>
                <tr>
                    <td>O001</td>
                    <td>Emily Clark</td>
                    <td>Italian Bistro</td>
                </tr>
                <tr>
                    <td>O002</td>
                    <td>Michael Brown</td>
                    <td>Fast Food Express</td>
                </tr>
            </table>
        </div>
        <div id="status" class="section">
            <h2>Status Catalog</h2>
            <table>
                <tr>
                    <th>Status ID</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>S001</td>
                    <td>Order Received</td>
                </tr>
                <tr>
                    <td>S002</td>
                    <td>Preparing</td>
                </tr>
                <tr>
                    <td>S003</td>
                    <td>Out for Delivery</td>
                </tr>
                <tr>
                    <td>S004</td>
                    <td>Delivered</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>

    `);
});

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT)
})
console.log(`Server is running on port ${process.env.PORT}`)