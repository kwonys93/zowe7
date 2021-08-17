pipeline {
    agent any
    environment {
        // Endevor Details
        ENDEVOR_CONNECTION="--port 6002 --protocol http --reject-unauthorized false"
        ENDEVOR_LOCATION="--instance ENDEVOR --env DEV --sys MARBLES --sub MARBLES --ccid JENKXX --comment JENKXX"
        ENDEVOR="$ENDEVOR_CONNECTION $ENDEVOR_LOCATION"

        JAVA_HOME="/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/jre"
        PATH = "/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/var/lib/zowe:/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/jre:$PATH"
        
/* 
        // z/OSMF Connection Details
        ZOWE_OPT_HOST=credentials('eosHost')
        ZOWE_OPT_PORT="443"
        ZOWE_OPT_REJECT_UNAUTHORIZED=false
*/
        // File Master Plus Connection Details
        FMP="--port 6001 --protocol https --reject-unauthorized false"

        // CICS Connection Details
        CICS="--port 6000 --region-name CICS00A1"

    }
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'gulp build-cobol'
/*                
                sh 'zowe plugins list'
                sh 'zowe --version'
                sh 'zowe --help'
                sh 'zowe profiles --help'
                sh 'pwd'
                sh 'sudo npm install gulp-cli -g'
                sh 'sudo npm install'
                sh 'sudo npm install gulp'
 */             
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
/*
                sh 'echo $PATH'
                sh 'whoami'
                sh 'su - root'
                sh 'gulp --tasks'
                sh 'zowe zosmf --help'
                sh 'zowe fmp --help'
 */ 
                sh 'gulp bind-n-grant'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                sh 'gulp test-data'
            }
        }
    }
}
