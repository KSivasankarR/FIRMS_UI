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
                echo "Using Node version ${NODE_VERSION}"
                // Install nvm and use node 16 if needed
                sh '''
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
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
                # Stop existing app if running
                pm2 delete ${APP_NAME} || true
                # Copy build to deploy path
                cp -r * ${DEPLOY_PATH}/
                cd ${DEPLOY_PATH}
                # Start app with pm2
                pm2 start npm --name "${APP_NAME}" -- start
                pm2 save
                """
            }
        }

        stage('Verify') {
            steps {
                echo "Verifying deployment..."
                sh "curl -I http://localhost:${PORT} || echo 'App not responding yet.'"
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
