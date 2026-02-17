pipeline {
    agent any

    environment {
        APP_NAME = "FIRMS_UI"
        APP_DIR  = "/var/lib/jenkins//FIRMS_UI"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh '''
                cd $APP_DIR
                npm install
                '''
            }
        }

        stage('Build Application') {
            steps {
                sh '''
                cd $APP_DIR
                npm run build
                '''
            }
        }

        stage('Start or Reload PM2') {
            steps {
                sh '''
                cd $APP_DIR

                pm2 describe $APP_NAME > /dev/null

                if [ $? -ne 0 ]; then
                    echo "Starting new PM2 process..."
                    pm2 start ecosystem.config.js
                else
                    echo "Reloading existing PM2 process..."
                    pm2 reload $APP_NAME
                fi

                pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment Successful!"
        }
        failure {
            echo "Deployment Failed!"
        }
    }
}
