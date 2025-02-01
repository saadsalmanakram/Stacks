# Load libraries
library(shiny)
library(tidyverse)
library(caret)
library(randomForest)
library(plotly)

# Load data (example: sensor data and maintenance logs)
sensor_data <- read.csv("data/sensor_data.csv")
maintenance_logs <- read.csv("data/maintenance_logs.csv")

# Data preprocessing (example: merge datasets and create features)
merged_data <- sensor_data %>%
  left_join(maintenance_logs, by = "asset_id") %>%
  mutate(
    failure = ifelse(is.na(maintenance_date), 0, 1),  # Binary target variable
    timestamp = as.POSIXct(timestamp, format = "%Y-%m-%d %H:%M:%S")
  )

# Train a predictive model (example: Random Forest)
set.seed(123)
model <- randomForest(failure ~ ., data = merged_data, ntree = 100)

# Define UI
ui <- fluidPage(
  titlePanel("Predictive Maintenance Dashboard"),
  sidebarLayout(
    sidebarPanel(
      selectInput("asset_id", "Select Asset ID:", choices = unique(merged_data$asset_id)),
      dateRangeInput("date_range", "Select Date Range:", start = min(merged_data$timestamp), end = max(merged_data$timestamp)),
      actionButton("predict", "Predict Failure")
    ),
    mainPanel(
      plotlyOutput("sensor_plot"),
      verbatimTextOutput("prediction_result")
    )
  )
)

# Define server logic
server <- function(input, output) {
  # Reactive data for selected asset and date range
  filtered_data <- reactive({
    merged_data %>%
      filter(asset_id == input$asset_id,
             timestamp >= input$date_range[1],
             timestamp <= input$date_range[2])
  })

  # Plot sensor data
  output$sensor_plot <- renderPlotly({
    data <- filtered_data()
    plot_ly(data, x = ~timestamp, y = ~sensor_value, type = "scatter", mode = "lines") %>%
      layout(title = "Sensor Data Over Time", xaxis = list(title = "Time"), yaxis = list(title = "Sensor Value"))
  })

  # Predict failure
  observeEvent(input$predict, {
    data <- filtered_data()
    prediction <- predict(model, newdata = data, type = "response")
    output$prediction_result <- renderPrint({
      if (any(prediction == 1)) {
        "Warning: High probability of failure detected!"
      } else {
        "No failure predicted."
      }
    })
  })
}

# Run the app
shinyApp(ui = ui, server = server)