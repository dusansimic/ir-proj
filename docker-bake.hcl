variable "IMAGE_REGISTRY" {
  default = "ghcr.io"
}

variable "IMAGE_REPOSITORY" {
  default = "dusansimic/ir-proj"
}

group "default" {
  targets = ["backend"]
}

target "backend" {
  context = "dalai/"
  dockerfile = "Dockerfile"
  tags = ["${IMAGE_REGISTRY}/${IMAGE_REPOSITORY}/dalai:latest"]
}
