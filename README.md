# infographic:population

I created this interactive infographic as part of the course “Programmiertes Entwerfen 2” during the summerterm 2014 at [Hochschule für Gestaltung Schwäbisch Gmünd](http://www.hfg-gmuend.de) taught by Prof. Jens Döring and Prof. Michael Götte.

It utilizes the [Paper.js](http://paperjs.org) library.

**Watch it live:** [www.christophlabacher.com/infographic-population](http://christophlabacher.com/infographic-population/) *Chrome recommended*

![Overview](/docu/01.png)

## Task

The task was to create an interactive, dynamic visualization that displays time-based data in some way.

The aim was not to make the data as accessible as possible (typography was not allowed), but to visualize it by creating a system of strict formal parameters (like shape, colour, behavior), all of which had to convey some information about a dataset. The visualization is therefore not very visually striking or creates great insight into complicated data, but it is highly formalized and stripped of any unnecessity. 


## Data 

|  | Germany | Great Britain | USA | China |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Inhabitants (in millions) | 81 | 64 | 319 | 1,356 |
| Births per year (per 1000 inhabitants) | 8.42 | 12.22 | 13.43 | 12.17 |
| Child-mortality (per 1000 births) | 3.46 | 4.44 | 6.17 | 14.7 |
| Men per woman | 1.06 | 1.05 | 1.05 | 1.11 |

## Concept

On screen there are several shapes, each representing one country, each country has a color assigned. The shape of the country is defined by its number of inhabitants: one corner for every 10 millions. In the center of the screen there is an additional shape which acts as an indicator for time.

If a child is born in a country (or: would statistically be born) a small shape in the corresponding colour moves out of the corresponding shape and moves freely around the screen.

In order not to lose overview as there are more and more “children” on screen they combine into larger groups: ten small circles (of one country) become one larger one, then of those become an even larger one, etc.

## Interaction

The user can control the flow of time by clicking on the time indicator or one of the countries. When one of the countries is selected, the “speed of time” changes, so that on child is “born” in this country every second – the other countries scale accordingly. When the time indicator is selected the visualization runs in real-time.

When groups have formed those can be clicked upon to zoom into them. The user is then presented an infographic about the children “contained” in this group: A triangle stands for a female, a square for a male child; the  darkened out children represent child mortality.

![Zoom10](/docu/03.png)
![Zoom100](/docu/02.png)

## Technology

The visualization was written in PaperScript (the paper.js version of JavaScript). It runs smoothest in Google Chrome, however it needs to be loaded from a server and can not be started locally (Chrome doesn’t allow loading a PaperScript file locally because of CORs).

## Additional information

A complete documentation of the project with explanations for all parameters is available in German: [Download](/docu/documentation.pdf)
