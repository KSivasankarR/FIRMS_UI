pipeline {
    agent any

    tools {
        nodejs 'Node16' // Ensure this NodeJS installation exists in Jenkins
    }

    environment {
        APP_NAME = "FIRMS_UI"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        PORT = "3008"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI"
        BACKUP_PATH = "/var/lib/jenkins/FIRMS_UI_backup"
        WATCH_MODE = "false"   // Set "true" to enable pm2 watch
        BACKUP_KEEP = 5        // Number of backups to keep
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Cloning repository..."
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Debug Environment') {
            steps {
                echo "Checking Node/npm/pm2 environment..."
                sh '''
                    echo "Current user: $(whoami)"
                    echo "Current directory: $(pwd)"
                    node -v
                    npm -v
                    if ! command -v pm2 >/dev/null 2>&1; then
                        echo "pm2 not found! Installing globally..."
                        npm install -g pm2
                    fi
                    pm2 -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo "Building the application..."
                sh 'npm run build'
            }
        }

        stage('Backup Previous Deploy') {
            steps {
                echo "Backing up previous deployment..."
                sh """
                    mkdir -p ${BACKUP_PATH}
                    if [ -d "${DEPLOY_PATH}" ]; then
                        mv ${DEPLOY_PATH} ${BACKUP_PATH}/${APP_NAME}_backup_\$(date +%F_%H-%M-%S)
                    fi

                    # Keep only last ${BACKUP_KEEP} backups
                    ls -1tr ${BACKUP_PATH} | grep ${APP_NAME}_backup_ | head -n -${BACKUP_KEEP} | xargs -d '\\n' rm -rf --
                """
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the application..."
                sh """
                    mkdir -p ${DEPLOY_PATH}

                    # Copy build folder to deploy path
                    rsync -av --exclude='.git' ./build/ ${DEPLOY_PATH}/

                    cd ${DEPLOY_PATH}

                    # Start or restart pm2 single process
                    if pm2 list | grep -q ${APP_NAME}; then
                        pm2 restart ${APP_NAME} --update-env
                    else
                        if [ "${WATCH_MODE}" = "true" ]; then
                            pm2 start npm --name "${APP_NAME}" -- start --watch
                        else
                            pm2 start npm --name "${APP_NAME}" -- start
                        fi
                    fi

                    pm2 save
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Verifying deployment..."
                sh """
                    RETRIES=5
                    COUNT=0
                    until curl -s --head http://localhost:${PORT} | grep "200 OK"; do
                        COUNT=\$((COUNT+1))
                        echo "Waiting for app to start... Attempt \$COUNT"
                        sleep 5
                        if [ \$COUNT -ge \$RETRIES ]; then
                            echo "App failed to respond after \$RETRIES attempts"
                            exit 1
                        fi
                    done
                    echo "App is running on port ${PORT}"
                """
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed! Rolling back to last backup..."
            sh """
                LAST_BACKUP=\$(ls -1tr ${BACKUP_PATH} | grep ${APP_NAME}_backup_ | tail -n 1)
                if [ -n "\$LAST_BACKUP" ]; then
                    echo "Restoring backup \$LAST_BACKUP..."
                    rm -rf ${DEPLOY_PATH}
                    mv ${BACKUP_PATH}/\$LAST_BACKUP ${DEPLOY_PATH}
                    cd ${DEPLOY_PATH}
                    if pm2 list | grep -q ${APP_NAME}; then
                        pm2 restart ${APP_NAME} --update-env
                    else
                        pm2 start npm --name "${APP_NAME}" -- start
                    fi
                    pm2 save
                else
                    echo "No backup found to restore!"
                fi
            """
        }
    }
}
