pipeline {
    agent any

    environment {
        APP_NAME = "FIRMS_UI"
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        NODE_VERSION = "16"
        PORT = "3008"
        REPO_URL = "https://github.com/KSivasankarR/FIRMS_UI"
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

        stage('Deploy') {
            steps {
                echo "Deploying the application..."

                sh """
                mkdir -p ${DEPLOY_PATH}

                # Use pm2 for zero-downtime reload
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                nvm use ${NODE_VERSION}

                cd ${DEPLOY_PATH}

                # Copy new build
                rsync -av --exclude='.git' ./ ${DEPLOY_PATH}/

                # Start or reload app with pm2
                if pm2 list | grep -q ${APP_NAME}; then
                    pm2 reload ${APP_NAME} --update-env
                else
                    pm2 start npm --name "${APP_NAME}" -- start
                fi

                pm2 save
                """
            }
        }

        stage('Verify') {
            steps {
                echo "Verifying deployment..."
                sh """
                sleep 5
                if curl -s --head http://localhost:${PORT} | grep "200 OK"; then
                    echo "App is running on port ${PORT}"
                else
                    echo "App not responding yet."
                    exit 1
                fi
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
