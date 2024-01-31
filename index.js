#!/usr/bin/env node

const yargs = require('yargs');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const handlebars = require('handlebars');
const copyfiles = require('copyfiles');
const { hideBin } = require('yargs/helpers');
const path = require('path'); 

const messages = {
    welcome: "Welcome to AdCraft!",
    watchMessage: "AdWatch is watching for changes...",
    configFileError: (configFile) => `Error: ${configFile} does not exist.`,
    fileChanged: (path) => `File ${path} has been changed`,
    copyingFiles: (srcPath, destPath) => `Copied from ${srcPath} to ${destPath}`,
    applyingOverrides: (srcPath, destPath) => `Applied override from ${srcPath} to ${destPath}`,
};

// Function to handle the 'watch' command
function watchCommand() {
    console.log(messages.watchMessage);
    // Read banner-project.json
    const configFile = 'banner-project.json';

    // Check if banner-project.json exists
    if (!fs.existsSync(configFile)) {
        console.error(messages.configFileError(configFile));
        return; // Exit the function if the file doesn't exist
    }

    // If the file exists, proceed with reading and parsing
    const config = fs.readJsonSync(configFile);

    // Set up file watchers and implement banner building logic
    // This is a simplified example. You will expand this part.
    chokidar.watch('src', { ignored: /(^|[\/\\])\../ }).on('change', (path) => {
        console.log(messages.fileChanged(path));
        buildBanners(config);
    });
}

// Function to build banners (this is where your main logic will go)
// Function to build banners
function buildBanners(config) {
    console.log('Building banners...');

    config.forEach(bannerConfig => {
        const { countries, bannerSizes } = bannerConfig;

        countries.forEach(country => {
            bannerSizes.forEach(size => {
                const bannerDir = `build/${country}/${size.width}x${size.height}`;
                fs.ensureDirSync(bannerDir); // Create directory if it doesn't exist
            
                const includeFileTypes = ['js', 'css', 'woff', 'woff2'];
                // Copy global files
                copySrcContents('src', bannerDir, includeFileTypes);
            
                // Copy font files to the root of the banner size directory
                const fontsSrcDir = 'fonts';
                const fontsDestDir = bannerDir;
                const fontExtensions = ['woff', 'woff2', 'ttf']; // Add the extensions for font files
                copyFilesToRoot(fontsSrcDir, fontsDestDir, fontExtensions);
            
                // Check and apply overrides
                const overrideDir = `src/overrides/${country}/${size.width}x${size.height}`;
                if (fs.existsSync(overrideDir)) {
                    applyOverrides(overrideDir, bannerDir);
                }
            
                // Compile handlebars template
                const templatePath = 'src/index.handlebars';
                if (fs.existsSync(templatePath)) {
                    const template = fs.readFileSync(templatePath, 'utf8');
                    const compileTemplate = handlebars.compile(template);

                    // Ensure that the size object is correctly passed to the template
                    const htmlContent = compileTemplate({ 
                        country, 
                        width: size.width, 
                        height: size.height 
                    });

                    const bannerDir = `build/${country}/${size.width}x${size.height}`;
                    fs.writeFileSync(`${bannerDir}/index.html`, htmlContent);
                }
            });
            
        });
    });
}

function copySrcContents(srcDir, destDir, excludeDir) {
    const excludedFiles = ['.DS_Store', 'index.handlebars']; // Add any files you want to exclude

    fs.readdirSync(srcDir).forEach(fileOrDir => {
        if (fileOrDir !== excludeDir && !excludedFiles.includes(fileOrDir)) {
            let srcPath = `${srcDir}/${fileOrDir}/*`; // Select all contents in the subdirectory
            let destPath = destDir;

            // Adjust 'up' parameter to flatten the path
            copyfiles([srcPath, destPath], { up: 2 }, err => { 
                if (err) console.log(messages.applyingOverrides(srcPath, destPath));
                else console.log(messages.copyingFiles(srcPath, destPath));
            });
        }
    });
}

function copyFilesToRoot(srcDir, destDir, fileExtensions) {
    fs.readdirSync(srcDir).forEach(fileOrDir => {
        const srcPath = `${srcDir}/${fileOrDir}`;
        const destPath = `${destDir}/${fileOrDir}`;

        // Check if the file matches any of the specified extensions
        const fileExtension = fileOrDir.split('.').pop();
        if (fileExtensions.includes(fileExtension)) {
            fs.copySync(srcPath, destPath, { overwrite: true });
        }
    });
}

function copyDirectory(srcDir, destDir) {
    fs.ensureDirSync(destDir); // Create destination directory if it doesn't exist
    fs.readdirSync(srcDir).forEach(fileOrDir => {
        const srcPath = path.join(srcDir, fileOrDir);
        const destPath = path.join(destDir, fileOrDir);

        if (fs.statSync(srcPath).isDirectory()) {
            // Recursively copy subdirectories
            copyDirectory(srcPath, destDir); // Updated to copy to the parent destination directory
        } else {
            // Copy individual files to the parent destination directory
            fs.copyFileSync(srcPath, destPath);
            console.log(messages.copyingFiles(srcPath, destPath));
        }
    });
}



function applyOverrides(overrideDir, bannerDir) {
    if (fs.existsSync(overrideDir)) {
        fs.readdirSync(overrideDir).forEach(subDir => {
            const subDirPath = path.join(overrideDir, subDir);
            if (fs.statSync(subDirPath).isDirectory()) {
                fs.readdirSync(subDirPath).forEach(file => {
                    const srcPath = path.join(subDirPath, file);
                    const destPath = path.join(bannerDir, file);
                    fs.copyFileSync(srcPath, destPath);
                    console.log(messages.copyingFiles(srcPath, destPath));
                });
            }
        });
    }
}

yargs(hideBin(process.argv))
  .scriptName("adcraft")
  .usage('Welcome to AdCraft!\n\nUsage: $0 <command> [options]')
  .command('watch', 'Watch a directory for changes and build banners', () => {
    watchCommand(); // Execute the watch command functionality
  })
  .command('$0', 'The default command', () => {
    console.log("Welcome to AdCraft!\n\nUse 'adcraft watch' to start watching a banner directory for changes.\nFor help, type 'adcraft --help'.");
  })
  .help()
  .argv;