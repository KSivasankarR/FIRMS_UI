pipeline {
    agent any

    tools {
        nodejs "Node16"
    }

    environment {
        DEPLOY_PATH = "/root/siva/FIRMS_UI"
        SERVER_IP = "10.10.120.190"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/KSivasankarR/FIRMS_UI.git',
                    credentialsId: 'KSivasankarR'
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
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Project') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to ${SERVER_IP}"

                // Use single-line sh commands instead of multi-line triple quotes
                sh "ssh -o StrictHostKeyChecking=no root@${SERVER_IP} 'mkdir -p ${DEPLOY_PATH}'"
                sh "scp -o StrictHostKeyChecking=no -r .next/* root@${SERVER_IP}:${DEPLOY_PATH}/"
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
