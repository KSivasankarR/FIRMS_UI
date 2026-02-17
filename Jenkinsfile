pipeline {
    agent any

    tools {
        nodejs 'Node16'  // Node >=16.10 or 18+
    }

    environment {
        APP_NAME = "FIRMS_UI"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        PORT = "3008"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI"
        BACKUP_PATH = "/var/lib/jenkins/FIRMS_UI_backup"
        BACKUP_KEEP = 5
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
                    echo "Node version:"
                    node -v
                    echo "NPM version:"
                    npm -v
                    npm install --verbose
                '''
            }
        }

        stage('Build') {
            steps {
                echo "Building Next.js application..."
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
                echo "Deploying application..."
                sh '''
                    mkdir -p ${DEPLOY_PATH}
                    rm -rf ${DEPLOY_PATH}/*
                    rsync -av --exclude='.git' --exclude='node_modules' ./ ${DEPLOY_PATH}/

                    cd ${DEPLOY_PATH}

                    pm2 delete ${APP_NAME} || true
                    pm2 start npm --name "${APP_NAME}" -- start
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
            echo "Deployment failed! Check logs above for details."
        }
    }
}
