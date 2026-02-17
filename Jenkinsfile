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
                sh '''
                echo "Installing Node.js dependencies (ignoring peer conflicts)..."
                npm install --legacy-peer-deps
                '''
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                echo "Building React app..."
                npm run build
                '''
            }
        }

        stage('Backup Old Build') {
            steps {
                sh '''
                if [ -d ${DEPLOY_PATH} ]; then
                    echo "Backing up previous build..."
                    TIMESTAMP=$(date +%Y%m%d%H%M%S)
                    cp -r ${DEPLOY_PATH} ${DEPLOY_PATH}_backup_${TIMESTAMP}
                    echo ${DEPLOY_PATH}_backup_${TIMESTAMP} > last_backup.txt
                fi
                '''
            }
        }

        stage('Deploy Build') {
            steps {
                sh '''
                echo "Deploying new build to ${DEPLOY_PATH}..."
                mkdir -p ${DEPLOY_PATH}
                rm -rf ${DEPLOY_PATH}/*
                cp -r build/* ${DEPLOY_PATH}/
                '''
            }
        }

        stage('Start/Reload PM2 Cluster') {
            steps {
                sh '''
                echo "Starting or reloading FIRMS_UI with PM2 cluster on port ${PORT}..."
                if pm2 list | grep ${APP_NAME}; then
                    pm2 reload ${APP_NAME} || exit 1
                else
                    pm2 start serve --name ${APP_NAME} -- ${DEPLOY_PATH} -s -l ${PORT} -p ${PORT} -n $(nproc) || exit 1
                fi
                pm2 save
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Verifying FIRMS_UI deployment..."
                sleep 5
                curl -I http://localhost:${PORT} || exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "🔥 FIRMS_UI Deployment Successful on port ${PORT} with PM2 Cluster!"
        }
        failure {
            echo "❌ Deployment Failed! Rolling back..."
            sh '''
            if [ -f last_backup.txt ]; then
                BACKUP=$(cat last_backup.txt)
                echo "Restoring backup: $BACKUP"
                rm -rf ${DEPLOY_PATH}/*
                cp -r $BACKUP/* ${DEPLOY_PATH}/
                pm2 reload ${APP_NAME} || echo "PM2 reload failed during rollback"
            else
                echo "No backup found to rollback!"
            fi
            '''
        }
    }
}
