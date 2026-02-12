pipeline {
    agent any

    tools {
        nodejs "Node16"
    }

    environment {
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
        APP_NAME    = "FIRMS_UI"
        PORT        = "3000"
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
                // Skip npm lifecycle scripts (so Husky prepare doesn’t run)
                sh 'npm install --legacy-peer-deps --ignore-scripts'
            }
        }

        stage('Build Project') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy & Run with PM2 (1 instance)') {
            steps {
                sh '''
                    # Create deploy directory
                    mkdir -p $DEPLOY_PATH

                    # Sync application code without .git and node_modules
                    rsync -av --exclude=".git" --exclude="node_modules" ./ $DEPLOY_PATH/

                    cd $DEPLOY_PATH

                    # Reinstall production dependencies (still skipping Husky)
                    npm install --production --legacy-peer-deps --ignore-scripts

                    # Remove existing PM2 process
                    pm2 delete "$APP_NAME" || true

                    # Start application with PM2 in single‑instance mode
                    PORT=$PORT pm2 start npm --name "$APP_NAME" -i 1 -- start

                    # Save PM2 list to restore after reboot
                    pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build & Deployment Successful'
        }
        failure {
            echo '❌ Build Failed'
        }
    }
}
