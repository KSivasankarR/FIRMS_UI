pipeline {
    agent any

    tools {
        nodejs 'Node16'  // Ensure Node16 is installed in Jenkins
    }

    environment {
        APP_NAME = "FIRMS_UI"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        PORT = "3008"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI"
        BACKUP_PATH = "/var/lib/jenkins/FIRMS_UI_backup"
        BACKUP_KEEP = 5
        NODE_ENV = "production"
        HUSKY_SKIP_INSTALL = "1" // Prevent Husky from running hooks in CI
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Cloning repository..."
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                sh '''
                    node -v
                    npm -v
                    npm install --verbose
                '''
            }
        }

        stage('Build') {
            steps {
                echo "Building Next.js SSR application..."
                sh '''
                    npm run build --verbose
                '''
            }
        }

        stage('Backup Previous Deploy') {
            steps {
                echo "Backing up previous deployment..."
                sh '''
                    mkdir -p ${BACKUP_PATH}
                    if [ -d "${DEPLOY_PATH}" ]; then
                        mv ${DEPLOY_PATH} ${BACKUP_PATH}/${APP_NAME}_backup_$(date +%F_%H-%M-%S)
                    fi
                    # Keep only last ${BACKUP_KEEP} backups
                    ls -1tr ${BACKUP_PATH} | grep ${APP_NAME}_backup_ | head -n -${BACKUP_KEEP} | xargs -r rm -rf
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying application with PM2 cluster mode..."
                sh '''
                    mkdir -p ${DEPLOY_PATH}
                    rm -rf ${DEPLOY_PATH}/*

                    # Copy project files excluding node_modules and .git
                    rsync -av --exclude='.git' --exclude='node_modules' ./ ${DEPLOY_PATH}/

                    cd ${DEPLOY_PATH}

                    # Stop existing PM2 process if it exists
                    pm2 delete ${APP_NAME} || true

                    # Start app in cluster mode, auto-restart enabled, same name
                    pm2 start npm --name "${APP_NAME}" -- run start -- -p ${PORT} -i max

                    # Save PM2 process list
                    pm2 save
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Verifying deployment..."
                sh '''
                    RETRIES=10
                    COUNT=0
                    until curl -s --head http://localhost:${PORT} | grep "200 OK"; do
                        COUNT=$((COUNT+1))
                        echo "Waiting for app to start... Attempt $COUNT"
                        sleep 5
                        if [ $COUNT -ge $RETRIES ]; then
                            echo "App failed to respond after $RETRIES attempts"
                            exit 1
                        fi
                    done
                    echo "App is running on port ${PORT}"
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed! Rolling back to last backup..."
            sh '''
                LAST_BACKUP=$(ls -1tr ${BACKUP_PATH} | grep ${APP_NAME}_backup_ | tail -n 1)
                if [ -n "$LAST_BACKUP" ]; then
                    echo "Restoring backup $LAST_BACKUP..."
                    rm -rf ${DEPLOY_PATH}
                    mv ${BACKUP_PATH}/$LAST_BACKUP ${DEPLOY_PATH}
                    cd ${DEPLOY_PATH}
                    pm2 delete ${APP_NAME} || true
                    pm2 start npm --name "${APP_NAME}" -- run start -- -p ${PORT} -i max
                    pm2 save
                else
                    echo "No backup found to restore!"
                fi
            '''
        }
    }
}
