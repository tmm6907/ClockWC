package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Serve the index.html file
	router.StaticFile("/", "./index.html")
	router.StaticFile("/components", "./components")

	// Start the server
	http.ListenAndServe(":8080", router)
}
