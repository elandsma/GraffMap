# GraffMap

GraffMap is a mobile application that enables users to catalog ephemeral street art they encounter out in the wild, by taking photos on location and adding them to the database. Users can view all artwork that has been contributed by others, categorized by geolocation and displayed chronologically.


GraffMap is currently in active development and is intended as a capstone project to demonstrate completion of the curriculum for a B.S. in Computer Science at the University of North Carolina at Asheville.

## Features

- Map View, using Google Maps API, enabling users to navigate the world and see instances of user-added artwork.
- Add Image view, enabling users to take photos on location and contribute them.
- Random Artwork View, shows a random individual datapoint


## Tech Stack


- [React Native](https://reactnative.dev) - Cross platform UI framework
- [Expo](https://expo.dev) - React Native development framework/platform
- [Supabase](https://supabase.com) - BaaS (open source Firebase alternative), utilizing a PostreSQL database



## Usage
GraffMap has not yet been deployed to the Apple store, however that is planned for the near future. In order to use GraffMap in its current iteration, you need an iOS device (iPhone or iPad). On that device, download "Expo Go" from the App store. You can find a direct link for ExpoGo [here](https://expo.dev/client).
Once ExpoGo is installed onto your device, visit [www.GraffMap.net](http://graffmap.net). If you access GraffMap.net from a computer, you can simply scan the QR code on the page using your iOS device. Alternatively, you can navigate directly to GraffMap.get via your iOS device, and click the link that says "Open in Expo Go".



# Future Features In Development/Consideration:
- Use global state management tool for various items
- Ability for users to 'flag' items for moderation
- Ability to add attribute tags when uploading art, and subsequently search/filter for these attributes.
- Add clustering to pins in map view
- Allow user to select image quality (viewing high-res may not be preferable when not connected to wi-fi)

> Some people are enraged, and some people are applauding. If there were a mission statement for graffiti, that would be it.
> [~Barry Mcgee](https://en.wikipedia.org/wiki/Barry_McGee) 
