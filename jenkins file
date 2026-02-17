pipeline {
    agent any

    environment {
        GIT_REPO = "https://github.com/KSivasankarR/FIRMS_UI.git"
        BRANCH   = "main"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        APP_NAME = "FIRMS_UI"
        PORT = "3008"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Backup Old Build') {
            steps {
                sh """
                if [ -d ${DEPLOY_PATH} ]; then
                    echo "Backing up previous build..."
                    TIMESTAMP=\$(date +%Y%m%d%H%M%S)
                    cp -r ${DEPLOY_PATH} ${DEPLOY_PATH}_backup_\${TIMESTAMP}
                fi
                """
            }
        }

        stage('Deploy Build') {
            steps {
                sh """
                echo "Deploying FIRMS_UI to ${DEPLOY_PATH}..."
                mkdir -p ${DEPLOY_PATH}
                rm -rf ${DEPLOY_PATH}/*
                cp -r build/* ${DEPLOY_PATH}/
                """
            }
        }

        stage('Start/Reload PM2 Cluster') {
            steps {
                sh """
                echo "Starting or reloading FIRMS_UI with PM2 cluster on port ${PORT}..."
                # Check if PM2 app exists
                if pm2 list | grep ${APP_NAME}; then
                    pm2 reload ${APP_NAME}
                else
                    pm2 start serve --name ${APP_NAME} -- ${DEPLOY_PATH} -s -l ${PORT} -p ${PORT} -n $(nproc)
                fi
                pm2 save
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                echo "Verifying FIRMS_UI deployment..."
                sleep 5
                curl -I http://localhost:${PORT}
                """
            }
        }
    }

    post {
        success {
            echo "🔥 FIRMS_UI Deployment Successful on port ${PORT} with PM2 Cluster!"
        }
        failure {
            echo "❌ FIRMS_UI Deployment Failed!"
        }
    }
}
