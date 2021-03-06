@Library('defra-library@4')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def containerSrcFolder = '\\/home\\/node'
def containerTag = ''
def dockerTestService = 'app'
def lcovFile = './test-output/lcov.info'
def localSrcFolder = '.'
def mergedPrNo = ''
def pr = ''
def serviceName = 'ffc-elm-apply'
def serviceNamespace = 'ffc-elm'
def sonarQubeEnv = 'SonarQube'
def sonarScanner = 'SonarScanner'
def timeoutInMinutes = 5

node {
  checkout scm
  try {
    stage('Set GitHub status as pending') {
      defraUtils.setGithubStatusPending()
    }
    stage('Set PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(serviceName, defraUtils.getPackageJsonVersion())
    }
    stage('Helm lint') {
      defraUtils.lintHelm(serviceName)
    }
    stage('Build test image') {
      defraUtils.buildTestImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(serviceName, dockerTestService, BUILD_NUMBER)
    }
    stage('Create JUnit report') {
      defraUtils.createTestReportJUnit()
    }
    stage('Fix lcov report') {
      defraUtils.replaceInFile(containerSrcFolder, localSrcFolder, lcovFile)
    }
    stage('SonarQube analysis') {
      defraUtils.analyseCode(sonarQubeEnv, sonarScanner, ['sonar.projectKey' : serviceName, 'sonar.sources' : '.'])
    }
    stage("Code quality gate") {
      defraUtils.waitForQualityGateResult(timeoutInMinutes)
    }
    stage('Push container image') {
      defraUtils.buildAndPushContainerImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, containerTag)
    }
    if (pr != '') {
      stage('Verify version incremented') {
        defraUtils.verifyPackageJsonVersionIncremented()
      }
      stage('Helm install') {
        withCredentials([
            string(credentialsId: "$serviceName-alb-tags", variable: 'albTags'),
            string(credentialsId: "$serviceName-alb-security-groups", variable: 'albSecurityGroups'),
            string(credentialsId: "$serviceName-alb-certificate-arn", variable: 'albCertificateArn')
          ]) {

          def helmValues = [
            /container.redeployOnChange="$containerTag-$BUILD_NUMBER"/,
            /ingress.alb.certificateArn="$albCertificateArn"/,
            /ingress.alb.securityGroups="$albSecurityGroups"/,
            /ingress.alb.tags="$albTags"/,
            /ingress.class="alb"/,
            /ingress.endpoint="$serviceName"/,
            /ingress.server="$INGRESS_SERVER"/,
            /pr="$containerTag"/
          ].join(',')

          def extraCommands = [
            "--set $helmValues"
          ].join(' ')

          defraUtils.deployChart(KUBE_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, containerTag, extraCommands)
          echo "Build available for review at https://$serviceName-$containerTag.$INGRESS_SERVER"
        }
      }
    }
    if (pr == '') {
      stage('Publish chart') {
        defraUtils.publishChart(DOCKER_REGISTRY, serviceName, containerTag)
      }
      stage('Trigger GitHub release') {
        withCredentials([
          string(credentialsId: 'github-auth-token', variable: 'gitToken')
        ]) {
          defraUtils.triggerRelease(containerTag, serviceName, containerTag, gitToken)
        }
      }
      stage('Deploy master') {
        withCredentials([
            string(credentialsId: "$serviceName-alb-tags", variable: 'albTags'),
            string(credentialsId: "$serviceName-alb-security-groups", variable: 'albSecurityGroups'),
            string(credentialsId: "$serviceName-alb-certificate-arn", variable: 'albCertificateArn')
          ]) {

          def helmValues = [
            /container.redeployOnChange="$containerTag-$BUILD_NUMBER"/,
            /ingress.alb.certificateArn="$albCertificateArn"/,
            /ingress.alb.securityGroups="$albSecurityGroups"/,
            /ingress.alb.tags="$albTags"/,
            /ingress.class="alb"/,
            /ingress.endpoint="$serviceName"/,
            /ingress.server="$INGRESS_SERVER"/
          ].join(',')

          def extraCommands = [
            "--set $helmValues"
          ].join(' ')

          defraUtils.deployRemoteChart(serviceNamespace, serviceName, containerTag, extraCommands)
        }
      }
    }
    stage('Set GitHub status as success') {
      defraUtils.setGithubStatusSuccess()
    }
  } catch(e) {
    defraUtils.setGithubStatusFailure(e.message)
    defraUtils.notifySlackBuildFailure(e.message, "#generalbuildfailures")
    throw e
  } finally {
    defraUtils.deleteTestOutput(serviceName, containerSrcFolder)
  }
}
