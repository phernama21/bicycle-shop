# Tech Challenge - Bicycle Shop

## 📋 1. Introduction
On this technical test the challenge was to build a website that allows a bicycle shop owner to sell his products online.

The platform must manage various bicycle components with conditional dependencies between parts, track inventory status, and calculate dynamic pricing where certain combinations affect the final cost.

The system should also be scalable to accommodate future product beyond bicycles.
## 🛠️ 2. Tech Stack

### Backend
- Ruby on Rails
- MySQL
- REST API Structure

### Frontend
- React / Next.js
- Typescript
- Tailwind CSS



*Docker for containerization*

> **Ruby:** 3.2
> **Rails:** 8.0.2
> **React:** 19
> **Next:** 15.2.4

## 🗃️ 3. DB Structure
I created the DB design as simple as possible, while making it sclabale and easy to grow and maintain.

```mermaid
classDiagram
    class Product {
        +int id
        +string name
        +text description
        +boolean active
        +string image
    }
    
    class Component {
        +int id
        +string name
        +text description
        +boolean required
        +int product_id
    }
    
    class Option {
        +int id
        +int component_id
        +string name
        +text description
        +decimal base_price
        +boolean in_stock
    }
    
    class Rule {
        +int id
        +int component_condition_id
        +int option_condition_id
        +int component_effect_id
        +int option_effect_id
        +int effect_type
        +decimal price_adjustment
        +int product_id
    }
    
    class Cart {
        +int id
        +int user_id
        +enum status
    }
    
    class CartItem {
        +int id
        +int cart_id
        +int product_id
        +int quantity
        +decimal price
    }
    
    class CartItemOption {
        +int id
        +int cart_item_id
        +int option_id
        +decimal price
    }
    
    class Order {
        +int id
        +int user_id
        +decimal total_amount
        +enum status
    }
    
    class OrderItem {
        +int id
        +int order_id
        +int product_id
        +int quantity
        +decimal price
    }
    
    class OrderItemOption {
        +int id
        +int order_item_id
        +int option_id
        +decimal price
    }
    
    class User {
        +int id
        +string first_name
        +string last_name
        +string email
        +string password_hash
        +boolean is_admin
    }

    Product "1" --> "*" Component : has
    Component "1" --> "*" Option : has
    Rule "0 ... *" --> "1" Option : affects
    Option "1" --> "0 ... *" Rule : defines
    User "1" --> "*" Cart : owns
    Cart "1" --> "*" CartItem : contains
    CartItem "1" --> "*" CartItemOption : includes
    User "1" --> "*" Order : places
    Order "1" --> "*" OrderItem : contains
    OrderItem "1" --> "*" OrderItemOption : includes
    Product "1" --> "*" CartItem : added_to

```

### Main models:
- `users`: normal users(clients) and admin users
- `products`: bicycles, skis, surfboards ...
- `components`: the different parts of products: wheels, frame, color ...
- `options`: component possible choices
- `rules`: defines the behaviour between options of the same product. For example, if a option A of component X is picked by the user, then the option B of component Y is unavailable
- `carts`: shopping cart containing the products customized by the users
- `orders`: orders placed by the users


## 📁 4. Project Structure

### Backend
The backend structure is pretty simple due to the low amount of models and therefore controllers.
```
api-backend/
├── app/
│   ├── controllers/
│   |   ├── api/        // main controllers
│   |   ├── users/      // devise token auth controllers
│   |   ├──api_controller.rb
│   |   └── application_controller.rb
│   ├── models/
│   └── uploaders/      // for uploading products photos

├── config/             // devise and CORS config
├── db/
│   ├── migrations/
│   └── schema.rb
└── ...
```
### Frontend
On the frontend I tried to maintain the cleanest structure possible while achieving:
- Clear separation between authentication, client and admin through Next.js route grouping
- Reusable components organised by purpose
- Centralized API communication with a dedicated lib
- Clean separation of concerns through isolated contexts and models

```
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/                 // auth pages (sign in, register...)
│   │   └── (shop)/
|   │       ├── (admin)/            //admin pages
│   |       └── products/           //client pages
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │   └── ...
│   ├── contexts/                   
│   ├── models/
│   └── lib/api.ts                  //for managing request and responses with token
├── package.json
└── ...
```
I want to make a special emphasis on the models folder, as each main model has the same folder structure:
```
user/
├── adapter/
├── domain/
└── infraestructure/
```
This approach creates a clear separation between business logic (domain), data access (infrastructure/repository), and integration layers (adapters). 

Also promotes maintainability through decoupling, facilitates easier testing of individual components, and enables seamless swapping of external dependencies without affecting core business logic.

## 👤 5. Main User Actions
Users can:
- Register and log in to the system
- Browse products
- Customize his own product by choosing the possible options
- View a summary of the chosen options and total price
- Add those customized products to the cart
- View on each moment the things that are on the cart
- Modify the cart by increasing the quantity of each product, adding or rmoving products
- Checkout the cart and creating an order

Admin Users can (in addition to the user actions):
- View all users and switching other users between admin or normal
- Browse, create and edit Products (name, description and image)
- Create, edit or delete Components (name, description and if it is required)
- Create, edit or delete Options (name, description, price and if has stock)
- Create edit and delete rules for every product,component and option (having verification for avoiding conflicting rules)
- Monitorize all orders (id, customer, status, amount, items, date)
- Browse and navigate over all models using search bar and pagination

## ⚙️ 6. Code Key Logic
### Create, edit and delete Products, Components and Options
The users can create a new Product by giving its new name. Then, it gets redirected to the product details page, where can eddit the name, description and add an image. On the same page, the user can also create, edit or delete new components, and the same applies for options.

As it follows a clear nested structure (Products --> Components --> Options) I decided to use `accept_nested_attributes_for`, a Rails method that lets you update or create nested models in a single form submission, reducing controller complexity while mantaining a clean API.
### Rule verification (backend)
A Rule is a key model for the workflow of this website. It links options of different component and change the normal behaviour between them. There is a conditional option that triggers the effect applied on the affected option. The effect can be `REQUIRE`, meaning that if a user picks an option A for a component X, then he must pick option B for component Y. Another effect is `EXCLUDE`,  meaning that if a user picks an option A for a component X, then option B of component Y is unavailable. Finally, there exists the effect type `CONDITIONAL PRICE`, meaning that if a user picks an option A for a component X, then the price of option B of component Y gets modified.

This implementation can lead to conflicting rules if not handled carefully that is why I've implemented three validations:

1) **No contradictory rules:** Checks if a rule with opposite effect_type but identical condition-effect relationships already exists

2) **No Duplicate Conditional Prices:** Prevents conflicting price rules for the same component/option combinations

3) **No Circular Dependencies:** Prevents two basic circular dependency types:
-  Self-referential: A component/option that affects itself
- Direct reciprocal: If A requires B, B cannot require A

> The current validation only detects direct circular relationships (A→B→A) but not more complex chains like A→B→C→A.

### Rule application (frontend)
The previous implementation works for creating and editing rules. But we also need to apply them when a user is picking the option for their customized products. 

Rules are fetched alongside the product in the initial useEffect. Then, every time a selection changes it checks if the option condition matched for any rule. If the condition is met then it apply the corresponding effect.

The total price is computed based on the selection while checking if there is a price adjustment for each selected option.

All that logic is displayed to the client through the UI:
1) Disabled options appear grayed out
2) Price adjustments appear in green to highlight the change (the previous price appears crossed out)

### Cart workflow

Another important feature is the shopping cart. Upon completing product customization and clicking "Add to Cart," a side panel slides in from the right displaying the current cart contents. Each cart item features:
- Product thumbnail image
- Product name and selected options summary
- Individual and subtotal pricing
- Quantity controls with increment/decrement buttons
- Remove item option

**Cart Persistence & Access:**

A floating cart icon remains visible in the bottom-right corner across all application screens, displaying the current item count. Clicking this icon reopens the cart panel from any location within the application.

**Checkout Process:**

When ready to complete their purchase, users can click the "Checkout" button in the cart panel. This action:

- Creates a new order record in the system
- Transitions the cart status to "Ordered"
- Displays an order confirmation
- Empties the active cart

> The system maintains cart state between sessions, allowing users to return and complete their purchase later.

## 💡 Future Implementations

The following features and enhancements are planned for future development cycles to improve the application's functionality, user experience, and maintainability:

### Technical Improvements

- **Implement Serializers:** Introduce consistent data serialization layer to standardize API responses and improve frontend/backend communication.
- **Icon System Standardization:** Replace mixed SVG implementations with a unified icon system to ensure visual consistency throughout the application.

### User Experience Enhancements

- **Cart Item Editing:** Enable users to modify configured products directly from the cart, rather than only allowing removal and re-addition.

- **Favorites & Rating System:** Implement functionality for users to save favorite configurations and provide product ratings/reviews.

### Administrative Capabilities

- **Enhanced Order Management:** Add administrative interfaces for customer service representatives to modify carts and orders on behalf of users.
- **User Profile Management:** Develop comprehensive user details pages allowing admins to manage see users information, preferences, and order history.

## 📚 7. Additional Libraries and Gems
### Backend
- `devise-token-auth` - For user authentication
- `carrierwave` - For uploading photos

### Frontend
- `tailwind` - For UI design
- `lucide-react` - Purpose/functionality
> I decided to use Tailwid over Bootstrap even when I never used it before because of the templates and ui-kits provided. 

## 🔄 8. Git Management
Despite being the sole contributor to this project, I maintained professional Git practices by implementing a structured branching strategy. Each significant feature or component was developed in its own dedicated branch, ensuring:

- **Code Isolation:** Features were developed independently to prevent conflicts
- **Atomic Commits:** Changes were organized into logical, focused commits
- **Clean History:** The main-shop branch was kept stable with only complete, tested features
- **Traceable Development:** Each feature's evolution can be clearly followed through its branch history

While traditional pull requests and issue tracking were not utilized due to the single-contributor nature of the project, this branch-based approach maintained code quality and established good habits for future collaborative development.

## 🚀 9. Quick Start

1. Install Docker if you don't have it already.
2. Clone this repository and navigate to the root folder
3. Run the following command:

```bash
docker-compose up --build
```

3. Access to the web:

    http://localhost:3001

### Test Credentials
- **Admin User** 👨‍💼
  - Email: admin@example.com
  - Password: password123

- **Regular User** 👤
  - Email: user@example.com
  - Password: password321

## 📄 License
CC BY-NC

## 👥 Author
Pau Hernando Màrmol