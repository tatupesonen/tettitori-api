# This is a helper script to start the MongoDB with the volume bound correctly
docker run -d -p 27017:27017 -v mongodata:/data/db mongo