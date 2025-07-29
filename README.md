# Car Rental App

<div align="center">

🇬🇧 [**English**](README.md) | 🇺🇦 [**Українська**](README_UKR.md)

</div>

## About the Project

**Car Rental App** is a modern and user-friendly web application designed to simplify the process of searching for and renting cars. It offers an intuitive interface, a wide selection of vehicles, and convenient filtering features that allow users to quickly find the perfect car for their needs.

## Key Features

- **Browse Car Catalog**: Explore a wide range of available rental cars with detailed information about each one.

- **Filtering and Search**: Efficiently search for cars by brand, price, and mileage to narrow down your options.

- **Add to Favorites**: Save your favorite cars for quick access in the future.

- **Detailed Car View**: Get complete information about each vehicle, including specifications, rental terms, and descriptions.

- **Booking Form**: A convenient form for quickly requesting a rental of the selected car.

- **Responsive Design**: The app displays correctly across various devices, from desktops to mobile phones.

## Technologies

The project is built using the following technologies:

- **React**: A library for building user interfaces.

- **React Router Dom**: For routing in a single-page application (SPA).

- **Redux Toolkit**: For efficient state management.

- **Axios**: For making HTTP requests to the API.

- **CSS Modules**: For component-level style isolation.

- **React Icons**: For convenient use of icons.

- **Vercel**: For fast and easy deployment.

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com/).
To ensure proper routing on Vercel (especially for the 404 page), a _vercel.json_ file has been added to the project root with the following content:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This ensures that all requests are redirected to _index.html_, allowing React Router Dom to handle client-side routing.

## Author

Yuriy Nabasov

[LinkedIn Profile](https://www.linkedin.com/in/iuriy-nabasov-b8b245308/)

[GitHub Profile](https://github.com/Yuriy-Nabasov)
