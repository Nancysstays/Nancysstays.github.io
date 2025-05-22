# My MVC App

This is a simple MVC application built using the ASP.NET Core framework. It demonstrates the basic structure and functionality of an MVC application.

## Project Structure

- **Controllers**: Contains the controller classes that handle user requests.
  - `HomeController.cs`: Manages requests related to the home page.

- **Models**: Contains the data models used in the application.
  - `HomeModel.cs`: Represents the data structure for the home page.

- **Views**: Contains the Razor views that define the UI.
  - **Home**: Contains views related to the home page.
    - `Index.cshtml`: The main view for the home page.

- **wwwroot**: Contains static files such as CSS and JavaScript.
  - **css**: Contains stylesheets for the application.
    - `site.css`: The main stylesheet for the application.
  - **js**: Contains JavaScript files for client-side functionality.
    - `site.js`: The main JavaScript file for the application.

- **appsettings.json**: Configuration settings for the application.

- **Program.cs**: The entry point of the application.

- **Startup.cs**: Configures services and the application's request pipeline.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Restore the dependencies using the command:
   ```
   dotnet restore
   ```
4. Run the application using the command:
   ```
   dotnet run
   ```
5. Open your web browser and navigate to `http://localhost:5000` to view the application.

## Usage

This application serves as a starting point for building MVC applications. You can modify the controllers, models, and views to suit your needs.