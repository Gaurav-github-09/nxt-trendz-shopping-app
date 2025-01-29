In this project, i've built a **Nxt Trendz - Shopping** app.

**Skills Used** - HTML, CSS, React.JS


**Live link** - https://nxtshopvgk.ccbp.tech/login


### Refer to the video below:




------------------------------------------------
### Sample User credentials
- Prime User credentials

  ```
   username: rahul
   password: rahul@2021
  ```

- Non-Prime User credentials

  ```
   username: raja
   password: raja@2021
  ```
------------------------------------------------


### This app will have the following functionalities.

- When an unauthenticated user, tries to access the Product Item Details Route, then the page will be navigated to Login Route
- When an authenticated user clicks on a product in the Products Route, then the page will be navigated to Product Item Details route
- When an authenticated user opens the Product Item Details Route,
  - An HTTP GET request will be made to **productDetailsApiUrl** with `jwt_token` in the Cookies and product `id` as path parameter
  - **_loader_** will be displayed while fetching the data
  - After the data is fetched successfully, app will display the product details and similar products received in the response
  - When an user clicks the product in the similar products, it will be navigated to the specific product item details route.
  - Initially, the quantity of the product will be `1`
  - The quantity of the product will be incremented by one when the plus icon is clicked
  - The quantity of the product will be decremented by one when the minus icon is clicked
  - If the HTTP GET request made is unsuccessful, then the [Failure view](https://assets.ccbp.in/frontend/content/react-js/nxt-trendz-product-details-error-lg-output.png) will be displayed
    - When the **Continue Shopping** button in the [Failure view](https://assets.ccbp.in/frontend/content/react-js/nxt-trendz-product-details-error-lg-output.png) is clicked, then the page will be navigated to Products Route
- When an item is added to the cart, cart will have the billing details, information about the product and delete Icon.
- When the delete icon is clicked in the cart, the cart item will be deleted. Then the respective billing details will be updated.
- When cart is empty it shows **No items in Cart** and a **Continue Shopping** button which will redirect to products page.
</details>

---------------------------------------------------------------------

# nxt-trendz-shopping-app
