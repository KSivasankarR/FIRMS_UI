pipeline {
    agent any

    tools {
        nodejs "Node16" // Node16 configured in Jenkins global tools
    }

    environment {
        DEPLOY_PATH = "/root/siva/FIRMS_UI"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/KSivasankarR/FIRMS_UI.git',
                    credentialsId: 'KSivasankarR' // Your GitHub credentials in Jenkins
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
                // Ignore peer dependency conflicts for CI
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Project') {
            steps {
                // Build without failing on ESLint warnings
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy & Run with PM2 Cluster') {
            steps {
                echo "Deploying locally to ${DEPLOY_PATH} with PM2 cluster mode"
                sh """
                    mkdir -p ${DEPLOY_PATH}
                    cp -r .next/* ${DEPLOY_PATH}/
                    cd ${DEPLOY_PATH}
                    pm2 delete FIRMS_UI || true
                    pm2 start npm --name "FIRMS_UI" -- run start
                    pm2 save
                """
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
