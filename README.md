<a id="readme-top"></a>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AverageAlpacaLover/Easy-mod-list-viewer-for-minecraft">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Easy Mod List Viewer</h3>

  <p align="center">
    Simple mod list viewer for your Minecraft modpacks
    <br />
    <a href="https://github.com/AverageAlpacaLover/Easy-mod-list-viewer-for-minecraft"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/AverageAlpacaLover/Easy-mod-list-viewer-for-minecraft/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/AverageAlpacaLover/Easy-mod-list-viewer-for-minecraft/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ABOUT THE PROJECT -->
## About The Project

Simple Html table viewer for Minecraft mod packs. With easy to read visuals, filters etc.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
<ul>
  <li>Create a txt file with specific structure.</li>
  <li>Don't forget to put mods .webp to "modIcons" folder under the same name as the mod name.</li>
  <li>Open the Html and choose list with mods file in the top right corner.</li>
</ul>
<br />
Mod list txt file structure:
<br />
<ul>
  <li>LinkToTheMod - any link that you will be redirected to the mod.</li>
  <li>NameOfTheMod - any name of the mod.</li>
  <li>ClientServer/Server/Client - just simple string to know, what mod type is.</li>
  <li>Dependencies - what another mods, separated by "/" symbol, are needed to make this exactly one to work.</li>
  <li>Needed For - for what another mods, separated by "/" symbol, this exactly one is needed.</li>
  <li>Description - for better understanding what mod is doing.</li>
  <li>---------</li>
</ul>
<br />
Blank Mod list txt file:
<br />

<br />LinkToTheMod
<br />NameOfTheMod
<br />ClientServer
<br />❌
<br />❌
<br />❌
<br />---------

<p align="right">(<a href="#readme-top">back to top</a>)</p>