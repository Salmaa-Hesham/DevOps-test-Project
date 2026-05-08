pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'salmahesham1114'
        IMAGE_NAME = 'devops-test-project'

        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:backend-${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:frontend-${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code from GitHub') {
            steps {
                git branch: 'main',
                    url: 'git@github.com:Salmaa-Hesham/DevOps-test-Project.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                    echo "Building backend Docker image..."
                    docker build -t $BACKEND_IMAGE -f backend/Dockerfile backend
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                    echo "Building frontend Docker image..."
                    docker build -t $FRONTEND_IMAGE -f frontend/Dockerfile frontend
                '''
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "Logging in to DockerHub..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Images to DockerHub') {
            steps {
                sh '''
                    echo "Pushing backend image..."
                    docker push $BACKEND_IMAGE

                    echo "Pushing frontend image..."
                    docker push $FRONTEND_IMAGE
                '''
            }
        }

        stage('Update Kubernetes Image Tags') {
            steps {
                sh '''
                    echo "Updating Kubernetes deployment files with new image tags..."

                    sed -i "s|image: salmahesham1114/devops-test-project:backend.*|image: $BACKEND_IMAGE|g" Deployment-backend.yml

                    sed -i "s|image: salmahesham1114/devops-test-project:frontend.*|image: $FRONTEND_IMAGE|g" Deployment-frontend.yml
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "Applying Kubernetes manifests..."

                    kubectl apply -f Deployment-backend.yml
                    kubectl apply -f Deployment-frontend.yml
                    kubectl apply -f back-service.yml
                    kubectl apply -f front-service.yml
                    kubectl apply -f ingress-nginx.yml
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh '''
                    echo "Checking Kubernetes resources..."

                    kubectl get pods -o wide
                    kubectl get svc
                    kubectl get ingress

                    echo "Checking backend deployment rollout..."
                    kubectl rollout status deployment/backend-deployment

                    echo "Checking frontend deployment rollout..."
                    kubectl rollout status deployment/frontend-deployment
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully. Application deployed to Kubernetes.'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage in the Jenkins console output.'
        }

        always {
            sh '''
                docker logout || true
            '''
        }
    }
}
