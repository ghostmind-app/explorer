# variables.tf

  variable "ENVIRONMENT" {}
variable "PORT" {}
variable "GOOGLE_OAUTH_CLIENT_ID" {}
variable "GOOGLE_OAUTH_CLIENT_SECRET" {}
variable "NEXTAUTH_URL" {}
variable "NEXTAUTH_SECRET" {}
variable "DB_USERS_ENDPOINT" {}
variable "DB_USERS_SECRET" {}
variable "DB_POTION_ENDPOINT" {}
variable "DB_POTION_SECRET" {}
variable "NEXT_PUBLIC_DB_POTION_ENDPOINT_WS" {}
variable "NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP" {}
variable "HASURA_GRAPHQL_JWT_SECRET" {}
variable "POCKET_CONSUMER_KEY" {}
variable "POCKET_REDIRECT_URI" {}
variable "CRYPTO_SECRET_KEY" {}
variable "NOTION_OAUTH_REDIRECT_URI" {}
variable "NOTION_OAUTH_CLIENT_ID" {}
variable "NOTION_OAUTH_CLIENT_SECRET" {}
variable "NEXT_PUBLIC_NOTION_OAUTH_REDIRECT_URI" {}
variable "NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID" {}
variable "API_ENDPOINT_URL" {}
variable "API_ENDPOINT_SECRET" {}
variable "NOTION_API_ENDPOINT_URL" {}
variable "NOTION_API_ENDPOINT_SECRET" {}
variable "DOMAIN_NAME" {}
variable "TUNNEL_HOSTNAME" {}
variable "IMAGE_DIGEST_DEFAULT" {}
variable "PROJECT" {}
variable "APP" {}
variable "GCP_PROJECT_ID" {}

  
  locals {
    env_vars = [
      {
        name  = "ENVIRONMENT"
        value = var.ENVIRONMENT
      },
    {
        name  = "GOOGLE_OAUTH_CLIENT_ID"
        value = var.GOOGLE_OAUTH_CLIENT_ID
      },
    {
        name  = "GOOGLE_OAUTH_CLIENT_SECRET"
        value = var.GOOGLE_OAUTH_CLIENT_SECRET
      },
    {
        name  = "NEXTAUTH_URL"
        value = var.NEXTAUTH_URL
      },
    {
        name  = "NEXTAUTH_SECRET"
        value = var.NEXTAUTH_SECRET
      },
    {
        name  = "DB_USERS_ENDPOINT"
        value = var.DB_USERS_ENDPOINT
      },
    {
        name  = "DB_USERS_SECRET"
        value = var.DB_USERS_SECRET
      },
    {
        name  = "DB_POTION_ENDPOINT"
        value = var.DB_POTION_ENDPOINT
      },
    {
        name  = "DB_POTION_SECRET"
        value = var.DB_POTION_SECRET
      },
    {
        name  = "NEXT_PUBLIC_DB_POTION_ENDPOINT_WS"
        value = var.NEXT_PUBLIC_DB_POTION_ENDPOINT_WS
      },
    {
        name  = "NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP"
        value = var.NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP
      },
    {
        name  = "HASURA_GRAPHQL_JWT_SECRET"
        value = var.HASURA_GRAPHQL_JWT_SECRET
      },
    {
        name  = "POCKET_CONSUMER_KEY"
        value = var.POCKET_CONSUMER_KEY
      },
    {
        name  = "POCKET_REDIRECT_URI"
        value = var.POCKET_REDIRECT_URI
      },
    {
        name  = "CRYPTO_SECRET_KEY"
        value = var.CRYPTO_SECRET_KEY
      },
    {
        name  = "NOTION_OAUTH_REDIRECT_URI"
        value = var.NOTION_OAUTH_REDIRECT_URI
      },
    {
        name  = "NOTION_OAUTH_CLIENT_ID"
        value = var.NOTION_OAUTH_CLIENT_ID
      },
    {
        name  = "NOTION_OAUTH_CLIENT_SECRET"
        value = var.NOTION_OAUTH_CLIENT_SECRET
      },
    {
        name  = "NEXT_PUBLIC_NOTION_OAUTH_REDIRECT_URI"
        value = var.NEXT_PUBLIC_NOTION_OAUTH_REDIRECT_URI
      },
    {
        name  = "NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID"
        value = var.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID
      },
    {
        name  = "API_ENDPOINT_URL"
        value = var.API_ENDPOINT_URL
      },
    {
        name  = "API_ENDPOINT_SECRET"
        value = var.API_ENDPOINT_SECRET
      },
    {
        name  = "NOTION_API_ENDPOINT_URL"
        value = var.NOTION_API_ENDPOINT_URL
      },
    {
        name  = "NOTION_API_ENDPOINT_SECRET"
        value = var.NOTION_API_ENDPOINT_SECRET
      },
    {
        name  = "DOMAIN_NAME"
        value = var.DOMAIN_NAME
      },
    {
        name  = "TUNNEL_HOSTNAME"
        value = var.TUNNEL_HOSTNAME
      },
    {
        name  = "IMAGE_DIGEST_DEFAULT"
        value = var.IMAGE_DIGEST_DEFAULT
      },
    {
        name  = "PROJECT"
        value = var.PROJECT
      },
    {
        name  = "APP"
        value = var.APP
      },
    {
        name  = "GCP_PROJECT_ID"
        value = var.GCP_PROJECT_ID
      }
    ]
  }
  
  