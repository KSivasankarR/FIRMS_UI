pipeline {
    agent any

    tools {
        nodejs "Node16" // Ensure Node16 is configured in Jenkins global tools
    }

    environment {
        DEPLOY_PATH = "/root/siva/FIRMS_UI"
        SERVER_IP = "10.10.120.190"
        APP_NAME = "FIRMS_UI" // PM2 process name
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
                // Ignore peer dependency conflicts for CI
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Project') {
            steps {
                // Build without failing on ESLint warnings
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to ${SERVER_IP}:${DEPLOY_PATH}"

                sh """
                    # Ensure deploy path exists on server
                    ssh root@${SERVER_IP} "mkdir -p ${DEPLOY_PATH}"

                    # Copy necessary files: build, public assets, package files
                    scp -r package.json package-lock.json public .next root@${SERVER_IP}:${DEPLOY_PATH}/

                    # Install dependencies on the server
                    ssh root@${SERVER_IP} "cd ${DEPLOY_PATH} && npm install --legacy-peer-deps"

                    # Restart the app using PM2
                    ssh root@${SERVER_IP} "cd ${DEPLOY_PATH} && pm2 stop ${APP_NAME} || true"
                    ssh root@${SERVER_IP} "cd ${DEPLOY_PATH} && pm2 start npm --name ${APP_NAME} -- start"
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
