pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        PORT = '3008'
        HOST = '0.0.0.0'
        APP_NAME = 'FIRMS_FRONTEND'
        APP_DIR = "/var/lib/jenkins"
        PM2_HOME = '/var/lib/jenkins.pm2'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                if [ -d "node_modules" ]; then
                    echo "Dependencies already installed. Skipping..."
                else
                    npm install --legacy-peer-deps
                fi
                '''
            }
        }

        stage('Clean Workspace') {
            steps {
                sh 'rm -rf .next'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

stage('Deploy with PM2') {
    steps {
        sh '''
        export PM2_HOME=${PM2_HOME}

        cd ${WORKSPACE}

        if pm2 describe ${APP_NAME} > /dev/null; then
            pm2 restart ${APP_NAME}
        else
            pm2 start npm --name ${APP_NAME} -- start
        fi

        pm2 save
        pm2 status
        '''
    }
}

    }

    post {
        success {
            echo "✅ Deployment successful!"
        }

        failure {
            echo "❌ Build failed. Attempting rollback..."

            sh '''
            if [ -n "$GIT_PREVIOUS_SUCCESSFUL_COMMIT" ]; then
                git fetch --all
                git checkout $GIT_PREVIOUS_SUCCESSFUL_COMMIT
                npm install --legacy-peer-deps
                npm run build
                pm2 restart ${APP_NAME}
                pm2 save
            else
                echo "⚠ No previous successful build found."
            fi
            '''
        }
    }
}
