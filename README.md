# trafficBetweenZips
Daemon to pull traffic data between Zip codes

An experiment to see what is the time to 'avoid' starting to work or returning back from work.
Is there a time window that is absolutely, consistently horrible for driving conditions due to traffic ?

This daemon uses Google Maps API to poll driving times every 15 minutes using node.js async library
The result is stored in MongoDB - but later I decided to emit the metrics using UDP to Graphite using a plugin provided for Heroku. 

Here is a snapshot from real-time monitoring


