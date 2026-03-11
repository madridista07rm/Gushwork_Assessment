# Gushwork_Assessment

# Project Overview
This project is a fully responsive product page for Mangalam HDPE Pipes, built as a frontend assessment. It replicates a Figma design for the product 

# File Structure

index.html — The main HTML file containing all page structure and content using semantic HTML5 elements
styles.css — All styling including layout, responsive breakpoints, animations, and component design
script.js — All JavaScript functionality including sticky header, image zoom, carousel, FAQ accordion, and scroll animations


# Key Features & Functionality
1. Sticky Header

A secondary header bar fixed to the very top of the screen, hidden by default (positioned at top: -60px)
When the user scrolls past 90% of the first viewport height, it slides down smoothly using a CSS cubic-bezier transition
When the user scrolls back up to the top, it disappears again automatically
The main navbar shifts downward using a with-sticky CSS class to avoid overlap
Uses requestAnimationFrame for performance-optimised scroll handling

2. Image Carousel with Zoom

Displays a main product image with previous/next arrow buttons to cycle through 5 images
Clicking any thumbnail at the bottom instantly swaps the main image
On hovering over the main image (desktop only, 1024px+), a zoom lens rectangle tracks the mouse cursor
A zoomed preview panel appears beside the image showing a 3× magnified version of the area under the lens
The zoom uses precise offset math to calculate cursor position relative to the image and maps it to the preview panel
Zoom is automatically disabled on smaller screens where there is no side space

3. Manufacturing Process Tabs

Eight clickable step tabs (Raw Material → Packaging)
Clicking a tab updates the title, description, and bullet points with a smooth fade transition using opacity animation
Active tab is highlighted with the navy brand colour
