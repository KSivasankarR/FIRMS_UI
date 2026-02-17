pipeline {
    agent any

    environment {
        APP_NAME = "FIRMS_UI"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        NODE_VERSION = "16"
        PORT = "3008"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI"
        BACKUP_PATH = "/var/lib/jenkins/FIRMS_UI_backup"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Cloning repository..."
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Setup Node') {
            steps {
                echo "Setting up Node version ${NODE_VERSION}"
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm install ${NODE_VERSION}
                nvm use ${NODE_VERSION}
                node -v
                npm -v
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
                if [ -d "${DEPLOY_PATH}" ]; then
                    mkdir -p ${BACKUP_PATH}
                    mv ${DEPLOY_PATH} ${BACKUP_PATH}/${APP_NAME}_backup_\$(date +%F_%H-%M-%S)
                fi
                """
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the application..."
                sh """
                mkdir -p ${DEPLOY_PATH}

                # Load nvm and Node
                export NVM_DIR="\$HOME/.nvm"
                [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
                nvm use ${NODE_VERSION}

                # Copy build folder to deploy path
                rsync -av --exclude='.git' ./build/ ${DEPLOY_PATH}/

                cd ${DEPLOY_PATH}

                # Start or restart app with pm2, single process, auto-restart
                if pm2 list | grep -q ${APP_NAME}; then
                    pm2 restart ${APP_NAME} --update-env
                else
                    pm2 start npm --name "${APP_NAME}" -- start --watch
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
            echo "Deployment failed!"
        }
    }
}
