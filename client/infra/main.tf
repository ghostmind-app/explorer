provider "google" {
  project = var.GCP_PROJECT_ID
}



resource "google_cloud_run_v2_service" "default" {
  name     = "${var.PROJECT}-${var.ENVIRONMENT}-${var.APP}"
  location = "us-central1"

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }

    containers {
      image = var.IMAGE_DIGEST_DEFAULT

      resources {
        limits = {
          cpu    = "2000m"
          memory = "4Gi"
        }

        cpu_idle          = true
        startup_cpu_boost = false
      }

      ports {
        container_port = var.PORT
      }

      ##########################################
      # DYNAMIC ENV START
      ##########################################


      dynamic "env" {
        for_each = local.env_vars
        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      ##########################################
      # DYNAMIC ENV END
      ##########################################
    }
  }
}


data "google_iam_policy" "noauth" {
  binding {
    role    = "roles/run.invoker"
    members = ["allUsers"]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_v2_service.default.location
  project  = google_cloud_run_v2_service.default.project
  service  = google_cloud_run_v2_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}




# resource "google_cloud_run_domain_mapping" "default" {
#   count = var.ENVIRONMENT == "prod" ? 1 : 0

#   location = "us-central1"
#   name     = var.DOMAIN_NAME

#   metadata {
#     namespace = var.GCP_PROJECT_ID
#   }

#   spec {
#     route_name = google_cloud_run_v2_service.default.name
#   }
# }
