pipeline {
    agent any

    tools {
        nodejs 'Node16'
    }

    environment {
        PORT = '3008'
        HOST = '0.0.0.0'
        APP_NAME = 'FIRMS_UI'
        APP_DIR = "${WORKSPACE}"
        PM2_HOME = '/var/lib/jenkins/.pm2'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci --legacy-peer-deps'
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

                  if pm2 describe ${APP_NAME} > /dev/null; then
                    echo "Restarting app..."
                    pm2 restart ${APP_NAME}
                  else
                    echo "Starting app..."
                    pm2 start npm --name ${APP_NAME} -- start
                  fi

                  pm2 save
                  pm2 status
                '''
            }
        }

    }  // ✅ THIS WAS MISSING (closes stages)

    post {
        failure {
            echo "❌ Build failed. Attempting rollback..."

            sh '''
              if [ -n "$GIT_PREVIOUS_SUCCESSFUL_COMMIT" ]; then
                git fetch --all
                git checkout $GIT_PREVIOUS_SUCCESSFUL_COMMIT
                npm ci --legacy-peer-deps
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
