#!/bin/bash


PORT=3000 # Changed to default Next.js port

# Check if a process is listening on the port
if lsof -ti :$PORT > /dev/null 2>&1; then
  echo "Server is already running on port $PORT. Stopping it..."
  kill $(lsof -ti :$PORT)
  pkill -f "npm run dev"
  echo "Server stopped."
fi

# Wait for port $PORT to be available
while nc -z localhost $PORT; do
  echo "Port $PORT is in use, waiting..."
  sleep 1
done

echo "Starting the server..."
npm run dev -- --port $PORT > out.log 2>&1 &
echo "Server started on port $PORT."

# Wait until the port starts listening
while ! nc -z localhost $PORT; do
  echo "Waiting for port $PORT to start listening..."
  sleep 1
done
echo "Port $PORT is now listening."
