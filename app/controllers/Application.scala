package controllers

import play.api.libs.json._
import play.api.mvc._
import models.Book._
import java.math.BigDecimal
import java.util.Date
import com.amazonaws.regions.Region
import com.amazonaws.regions.Regions
import com.amazonaws.services.cloudwatch.AmazonCloudWatchClient

import com.amazonaws.services.cloudwatch.model._

import scala.collection.JavaConverters._

object Application extends Controller {

  val cloudWatch = new AmazonCloudWatchClient()
  cloudWatch.setRegion(
      Region.getRegion(Regions.US_WEST_2));
  
  implicit val dimensionWrites = new Writes[Dimension] {
    def writes(d: Dimension) = Json.obj(
        "name" -> d.getName(),
        "value" -> d.getValue()
    )
  }

  def x(d: Double):JsNumber = {
    if (d == null) null else JsNumber(new BigDecimal(d))
  }
  
  implicit val datapointWrites = new Writes[Datapoint] {
    def writes(d: Datapoint) = if (d == null) null else Json.obj(
        "sum" -> x(d.getSum()),
        "timestamp" -> d.getTimestamp(),
        "unit" -> d.getUnit()
    )
  }
  
  implicit val metricWrites = new Writes[Metric] {
    def writes(m: Metric) = Json.obj(
        "metricName" -> m.getMetricName(),
        "namespace" -> m.getNamespace(),
        "dimensions" -> m.getDimensions().asScala
    )
  }
  implicit val listMetricsResultWrites = new Writes[ListMetricsResult] {
    def writes(result: ListMetricsResult) = Json.obj(
        "metrics" -> result.getMetrics().asScala,
        "nextToken" -> result.getNextToken()
    )
  }
  
  implicit val getMetricsResultWrites = new Writes[GetMetricStatisticsResult] {
    def writes(result: GetMetricStatisticsResult) = Json.obj(
      "label" -> result.getLabel(),
      "datapoints" -> result.getDatapoints().asScala
    )
  }
  
  def listMetrics = Action {
    val metrics = cloudWatch.listMetrics()
    Ok(Json.toJson(metrics))
  }
  
  def getTransactions = Action {
    val days = 1
    val period = 60
    val endTime = new Date(System.currentTimeMillis())
    val startTime = new Date(System.currentTimeMillis() - (days * 24 * 60 * 60 * 1000))
    val request = new GetMetricStatisticsRequest()
      .withEndTime(endTime)
      .withMetricName("Transactions")
      .withNamespace("com.strongfellow.transactions")
      .withPeriod(period * 60)
      .withStartTime(startTime)
      .withStatistics(Statistic.Sum)
    val response = cloudWatch.getMetricStatistics(request)
    Ok(Json.toJson(response))
  }
  
  def listBooks = Action {
    Ok(Json.toJson(books))
  }

  def saveBook = Action(BodyParsers.parse.json) { request =>
    val b = request.body.validate[Book]
    b.fold(
      errors => {
        BadRequest(Json.obj("status" -> "OK", "message" -> JsError.toFlatJson(errors)))
      },
      book => {
        addBook(book)
        Ok(Json.obj("status" -> "OK"))
      }
    )
  }
}
