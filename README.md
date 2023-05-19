# parcourspe-app

## Development currently on hold

I'm no longer actively contributing to the project.

## A simple website to (try to) predict ParcourSup ranking evolution

This project provides a website in which you can enter your daily ParcourSup rankings.

From this data a model is computed which gives a predicted date of admission.

At first the project was supposed to have both a backend and a frontend but I had some issues with the harware used to host the backend. Now there is only the frontend left so all the code is run directly on your computer.

Anyways, I had not implemented yet the finetuning of the predictions (that would be done by regrouping for each establishement the data of every user ranked there) so it does not change much.
	
## How to use

you can use the website :

https://clementtariel.github.io/parcourspe-app/

or you can clone this repo and build the electron version.

## How it works

There is no statistical/mathematical evidence that the results are somehow accurate.

The process is quite simple : the evolution of the ranking is assumed to have an exponential shape (it is an arbitrary assumption). The model is computed by smoothing the input data, using a log scale, using a linear regression, and using an exp to cancel the log used previously.

## Known issues

- The model is not proven to be accurate.
- The project is not up to date with the latest improvements of ParcourSup.
- There is no session system so 2 people can not seperate their data if they use the same browser on the same computer.
- I did not know any framework when I started the project so it is pure html, css and js. On top of that the code is not very well documented so maintainability is not great (spaghetti code everywhere).
- Depending on the browser used there might be some weird rendering.
- Some functionnalities are still missing.
