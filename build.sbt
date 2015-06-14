name := """simple-rest-scala"""

version := "1.0-SNAPSHOT"

lazy val root = project.in(file(".")).enablePlugins(PlayScala)

libraryDependencies += "com.amazonaws" % "aws-java-sdk-cloudwatch" % "1.10.0"
