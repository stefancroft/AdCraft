AdCraft
AdCraft is a powerful command-line tool for building and managing HTML5 banner ads for digital advertising campaigns. With AdCraft, you can streamline the process of creating and updating banner ads, making it easy to maintain consistency and efficiency in your advertising projects.

Features
Watch for Changes: AdCraft allows you to watch a specified directory for changes. Whenever a change is detected, it automatically rebuilds your banner ads, saving you time and effort.

Customisable Configuration: AdCraft is highly configurable. You can define your banner ad configurations, including the target countries, banner sizes, and more, in a banner-project.json file.

Template-Based: Create banner ads using Handlebars templates. AdCraft compiles your templates and generates the HTML files for your ads.

Overrides: Customize individual banner ads by providing overrides in the src/overrides directory. AdCraft will apply these overrides to the generated ads.

Font and Asset Management: AdCraft handles font and asset copying, ensuring that your banner ads have all the necessary resources.

Getting Started
To get started with AdCraft, follow these simple steps:

Installation
Clone this repository to your local machine.

Navigate to the project directory in your terminal.

Run the following commands to install AdCraft and make it globally available:

npm install
npm link
Usage
Now that AdCraft is installed, you can use its commands to streamline your banner ad development process:

Watch for Changes: Start watching a directory for changes using the following command:

adcraft watch

AdCraft will monitor your specified banner directory for changes in real-time. When it detects a change, it will rebuild your banner ads automatically.

Configuration
AdCraft uses a banner-project.json file to configure your banner ad projects. In this file, you can define the countries, banner sizes, and other project-specific settings. Be sure to update this file to match your project requirements.

Example Project Structure
Here's an example project structure to help you get started:

plaintext
Copy code
- src/
  - index.handlebars  # Handlebars template for banner ads
  - overrides/        # Overrides for individual banner ads
- fonts/              # Font files for your banner ads
- banner-project.json  # Configuration file for your banner ad projects

License
This project is licensed under the MIT License. Feel free to customize and use AdCraft in your projects.

Support
If you encounter any issues or have questions, please feel free to open an issue on this repository. We're here to help!

Happy banner ad development with AdCraft!