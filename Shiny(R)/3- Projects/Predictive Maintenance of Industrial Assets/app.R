# Load required libraries
library(shiny)
library(shinydashboard)
library(dplyr)
library(ggplot2)
library(plotly)
library(randomForest)
library(DT)

# Sample sensor data (replace this with actual data from 'data/sensor_data.csv')
sensor_data <- data.frame(
  asset_id = rep(1:5, each = 100),
  date = seq.Date(from = as.Date("2023-01-01"), by = "day", length.out = 500),
  temperature = runif(500, min = 60, max = 100),
  vibration = runif(500, min = 0.1, max = 2),
  pressure = runif(500, min = 10, max = 50)
)

# UI Layout
ui <- dashboardPage(
  dashboardHeader(title = "Predictive Maintenance Dashboard"),
  dashboardSidebar(
    sidebarMenu(
      menuItem("Asset Overview", tabName = "overview", icon = icon("dashboard")),
      menuItem("Health Monitoring", tabName = "health", icon = icon("heartbeat")),
      menuItem("Failure Prediction", tabName = "prediction", icon = icon("exclamation-triangle"))
    )
  ),
  dashboardBody(
    tabItems(
      # Asset Overview Tab
      tabItem(tabName = "overview",
              fluidRow(
                box(plotlyOutput("asset_health"), width = 12)
              ),
              fluidRow(
                box(DTOutput("asset_table"), width = 12)
              )
      ),
      
      # Health Monitoring Tab
      tabItem(tabName = "health",
              fluidRow(
                box(plotOutput("sensor_trend"), width = 12)
              )
      ),
      
      # Failure Prediction Tab
      tabItem(tabName = "prediction",
              fluidRow(
                box(plotlyOutput("failure_forecast"), width = 12)
              )
      )
    )
  )
)

# Server Logic
server <- function(input, output) {
  # Preprocess and aggregate data for asset health
  asset_summary <- sensor_data %>%
    group_by(asset_id) %>%
    summarise(temperature_avg = mean(temperature),
              vibration_avg = mean(vibration),
              pressure_avg = mean(pressure))

  # Asset Health Overview
  output$asset_health <- renderPlotly({
    ggplotly(
      ggplot(asset_summary, aes(x = factor(asset_id), y = temperature_avg, fill = factor(asset_id))) +
        geom_bar(stat = "identity") +
        labs(title = "Average Temperature per Asset", x = "Asset ID", y = "Avg Temperature")
    )
  })

  # Asset Table
  output$asset_table <- renderDT({
    datatable(asset_summary, options = list(pageLength = 5))
  })

  # Sensor Trend Plot (Temperature over time)
  output$sensor_trend <- renderPlot({
    ggplot(sensor_data, aes(x = date, y = temperature, color = factor(asset_id))) +
      geom_line() +
      labs(title = "Temperature Trend Over Time", x = "Date", y = "Temperature")
  })

  # Placeholder for Failure Prediction Model
  output$failure_forecast <- renderPlotly({
    forecast_data <- sensor_data %>%
      group_by(date) %>%
      summarise(failure_risk = runif(1, min = 0, max = 1))
    
    ggplotly(
      ggplot(forecast_data, aes(x = date, y = failure_risk)) +
        geom_line(color = "red") +
        labs(title = "Failure Risk Forecast", x = "Date", y = "Risk Probability")
    )
  })
}

# Run the App
shinyApp(ui = ui, server = server)
