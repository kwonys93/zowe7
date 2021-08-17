pipeline {
    agent any
    environment {
        // Endevor Details
        ENDEVOR_CONNECTION="--port 6002 --protocol http --reject-unauthorized false"
        ENDEVOR_LOCATION="--instance ENDEVOR --env DEV --sys MARBLES --sub MARBLES --ccid JENKXX --comment JENKXX"
        ENDEVOR="$ENDEVOR_CONNECTION $ENDEVOR_LOCATION"

        JAVA_HOME="/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/jre"
        
        PATH = "/opt/rh/rh-nodejs10/root/usr/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/var/lib/zowe:/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/jre:$PATH"
        
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
        stage('Update-cobol') {
            steps {
                echo 'Updating cobol source code in Endevor..'
                sh 'gulp update-cobol'
            }
        }
        stage('Build-cobol') {
            steps {
                echo 'Building cobol..'
                sh 'gulp build-cobol'
            }
        }
        stage('Build-lnk') {
            steps {
                echo 'Building module to CICS..'
                sh 'gulp build-lnk'
            }
        }
        stage('Copy-load') {
            steps {
                echo 'Copying module to CICS env..'
                sh 'gulp copy-load'
            }
        }
        stage('Copy-dbrm') {
            steps {
                echo 'Copying dbrm to db2 env for db2 bind..'
                sh 'gulp copy-dbrm'
            }
        }
        stage('CICS-refresh') {
            steps {
                echo 'New copying module in CICS..'
                sh 'gulp cics-refresh'
            }
        }
        stage('Bind-n-grant') {
            steps {
                echo 'Binding db2 plan and granting..'
                sh 'gulp bind-n-grant'
            }
        }
        stage('Test-tran') {
            steps {
                echo 'Testing transaction..'
                sh 'gulp test-tran'
            }
        }
         stage('Verify-data') {
            steps {
                echo 'verifying data for the test result..'
                sh 'gulp verify-data'
            }
        }
        /*
        stage('Test-validation') {
            steps {
                    echo 'Validating..'
                    sh 'chmod -R 777 /var/lib/jenkins/workspace/BCA-PIPELINE-DEMO/node_modules/.bin/*'
                    sh 'npm test'
            }
        }
        */
    }
}
