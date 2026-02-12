pipeline {
    agent any

    tools {
        nodejs "Node16" // Make sure Node16 is installed in Jenkins
    }

    environment {
        DEPLOY_PATH = "/root/siva/FIRMS_UI"
        SERVER_IP = "10.10.120.190"
        APP_NAME = "FIRMS_UI" // PM2 process name
        INSTANCES = "max"     // 'max' means PM2 will use all CPU cores
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

        stage('Deploy & Run with PM2 Cluster') {
            steps {
                echo "Deploying to ${SERVER_IP} in PM2 cluster mode"

                // Copy files to remote server
                sh """
                    ssh -o StrictHostKeyChecking=no root@${SERVER_IP} "mkdir -p ${DEPLOY_PATH}"
                    scp -o StrictHostKeyChecking=no -r .next package.json package-lock.json node_modules root@${SERVER_IP}:${DEPLOY_PATH}/
                """

                // Start app in PM2 cluster mode
                sh """
                    ssh -o StrictHostKeyChecking=no root@${SERVER_IP} '
                        cd ${DEPLOY_PATH} &&
                        pm2 stop ${APP_NAME} || true &&
                        pm2 delete ${APP_NAME} || true &&
                        pm2 start npm --name "${APP_NAME}" -i ${INSTANCES} -- start &&
                        pm2 save
                    '
                """
            }
        }
    }

    post {
        success {
            echo '✅ Build & Deployment Successful (PM2 Cluster Mode)'
        }
        failure {
            echo '❌ Build Failed'
        }
    }
}
