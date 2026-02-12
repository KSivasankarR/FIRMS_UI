pipeline {
    agent any

    tools {
        nodejs "Node16" // Make sure this NodeJS installation is configured in Jenkins global tools
    }

    environment {
        DEPLOY_PATH = "/root/siva/FIRMS"
        SERVER = "10.10.120.190"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI.git"
        BRANCH = "main"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}",
                    url: "${REPO_URL}",
                    credentialsId: 'KSivasankarR' // Your GitHub credentials ID
            }
        }

        stage('Check Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                // Disable CI warnings for ESLint if needed
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy') {
            steps {
                // Copy build files to the server
                sh """
                ssh ${SERVER} 'sudo mkdir -p ${DEPLOY_PATH}'
                scp -r .next/* ${SERVER}:${DEPLOY_PATH}/
                scp -r public/* ${SERVER}:${DEPLOY_PATH}/
                """
            }
        }
    }

    post {
        success {
            echo '✅ Build & Deployment Successful'
        }
        failure {
            echo '❌ Build Failed'
        }
    }
}
