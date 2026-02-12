pipeline {
    agent any

    tools {
        nodejs "Node16"
    }

    environment {
        DEPLOY_PATH = "/var/lib/jenkins/FIRMS_UI"
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
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Project') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy & Run with PM2 Cluster') {
            steps {
                sh """
                    mkdir -p ${DEPLOY_PATH}
                    cp -r . ${DEPLOY_PATH}/
                    cd ${DEPLOY_PATH}
                    npm install --legacy-peer-deps
                    pm2 delete FIRMS_UI || true
                    pm2 start npm --name FIRMS_UI -i max -- run start
                    pm2 save
                """
            }
        }
    }

    post {
        success {
            echo 'Build & Deployment Successful'
        }
        failure {
            echo 'Build Failed'
        }
    }
}
