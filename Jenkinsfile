pipeline {
    agent any

    tools {
        nodejs 'Node16'  // Ensure Node16 tool is configured in Jenkins
    }

    environment {
        APP_NAME = "FIRMS_UI"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        PORT = "3008"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI"
        BACKUP_PATH = "/var/lib/jenkins/FIRMS_UI_backup"
        BACKUP_KEEP = 5
        NODE_ENV = "production"          // Required for Next.js build
        // You can add NEXT_PUBLIC_* environment variables here if needed
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
                echo "Building Next.js CSR application..."
                sh '''
                    npm run build --verbose
                    npm run export -- -o out  # Export static files to ./out
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
                echo "Deploying application..."
                sh '''
                    mkdir -p ${DEPLOY_PATH}
                    rm -rf ${DEPLOY_PATH}/*
                    rsync -av --exclude='.git' --exclude='node_modules' ./out/ ${DEPLOY_PATH}/

                    # Stop previous PM2 process
                    pm2 delete ${APP_NAME} || true

                    # Start the app with PM2 (serve static files)
                    pm2 start serve --name "${APP_NAME}" -- -s ${DEPLOY_PATH} -l ${PORT}

                    pm2 save
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Verifying deployment..."
                sh '''
                    RETRIES=5
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
                    pm2 delete ${APP_NAME} || true
                    pm2 start serve --name "${APP_NAME}" -- -s ${DEPLOY_PATH} -l ${PORT}
                    pm2 save
                else
                    echo "No backup found to restore!"
                fi
            '''
        }
    }
}
