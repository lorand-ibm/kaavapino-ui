import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  YAxis,
  XAxis,
  Legend,
  CartesianGrid,
  Line,
  Bar,
  ResponsiveContainer,
  ComposedChart,
  Label
} from 'recharts'
import { useTranslation } from 'react-i18next'
import FilterList from './Filters/FilterList'
import { Grid, GridColumn, Popup } from 'semantic-ui-react'
import { isNaN } from 'lodash'
import { getChartData, BUSINESS_PREMISES, OTHER, OVERALL, PREDICTION, PUBLIC } from './chartUtils'
import { projectOverviewSelector } from '../../selectors/projectSelector'

import { getProjectsOverview } from '../../actions/projectActions'
import { connect } from 'react-redux'
import { LoadingSpinner } from 'hds-react'

function FloorAreaChart({ current, total, data, filters, chartData, getProjectsOverview }) {
  const { t } = useTranslation()

  const [filter, setFilter] = useState({})

  const [overallData, setOverallData] = useState(data)
  const [currentChartData, setCurrentChartData ]= useState( getChartData(chartData))

  useEffect(() => {
    getProjectsOverview()
  }, [])

  useEffect(() => {
    setCurrentChartData( getChartData(chartData))
    setOverallData( data )

  }, [data, chartData])

  const onFilterChange = (value, name) => {
    setFilter({
      ...filter,
      [name]: value
    })
  }
  const CustomizedLabel = props => {
    const { fill, x, y, width, height, value } = props

    if (isNaN(height)) {
      return null
    }

    let currentHeight = height / value

    if (currentHeight < 0) {
      currentHeight = -currentHeight
    }

    const renderList = () => {
      const rects = []
      for (let index = 1; index <= value; index++) {

        let  currentY =  y + index * currentHeight - currentHeight
        rects.push(
          <Popup
            on="click"
            key={index + props.payload.date}
            trigger={
             (
             <g key={index}>
                <rect
                  x={x}
                  y={currentY}
                  width={width}
                  height={currentHeight - 3}
                  stroke="none"
                  fill={fill}
                  className="bar"
                  style={{ stroke: 'black', strokeWidth: 1 }}
                  data-for="test"
                ></rect>
              </g>
             )
            }
          >
            {index + props.payload.date}
          </Popup>
        )
      }

      return rects
    }
    const rects = renderList()

    return <svg>{rects}</svg>
  }
  if ( !currentChartData ) {
   return  <LoadingSpinner className="center" />
  }

  return (
    <div className="floor-area">
      <Grid stackable columns="equal">
        <Grid.Column>
          <h3>{t('floor-area.title', { date: overallData.currentDate })}</h3>
        </Grid.Column>
        <GridColumn textAlign="right">
          <FilterList currentFilter={filter} onChange={onFilterChange} filterList={filters} />
        </GridColumn>
      </Grid>

      <div className="total-floor-area">
        <span className="current-number">
          {t('floor-area.current-number', { current })}
        </span>
        <span>{t('floor-area.total-number', { total })}</span>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={currentChartData.floorAreas}>
          <XAxis dataKey="date" interval={0} angle={-45} textAnchor="end" />
          <YAxis yAxisId="left">
            <Label
              dx={-15}
              angle={-90}
              position="centerTop"
              value={t('floor-area.y-axis-title')}
            ></Label>
          </YAxis>
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 20]}
            scale="linear"
            hide={false}
          >
            <Label
              angle={-90}
              position="centerTop"
              style={{ fontSize: '12px' }}
              value={t('floor-area.y-axis-title-projects-in-meeting')}
            ></Label>
          </YAxis>
          <Bar
            shape={<CustomizedLabel />}
            isAnimationActive={false}
            yAxisId="right"
            dataKey="meetings"
            fill="lightBlue"
            legendType="none"
          />
          <Legend />
          <CartesianGrid yAxisId="left" vertical={false} opacity={0.4} />

          <Line
            isAnimationActive={false}
            legendType="plainline"
            name={t('floor-area.all-area')}
            type="monotone"
            dataKey={OVERALL}
            stroke="grey"
            strokeWidth="2px"
            dot={false}
            yAxisId="left"
          />

          <Line
            isAnimationActive={false}
            legendType="none"
            type="monotone"
            dataKey={OVERALL+PREDICTION}
            stroke="grey"
            strokeDasharray="3 3"
            strokeWidth="2px"
            dot={false}
            yAxisId="left"
          />
          <Line
            isAnimationActive={false}
            legendType="plainline"
            name={t('floor-area.living-area')}
            type="monotone"
            dataKey={PUBLIC}
            stroke="blue"
            strokeWidth="2px"
            dot={false}
            yAxisId="left"
          />
          <Line
            isAnimationActive={false}
            legendType="none"
            type="monotone"
            dataKey={PUBLIC+PREDICTION}
            stroke="blue"
            strokeWidth="2px"
            strokeDasharray="3 3"
            dot={false}
            yAxisId="left"
          />

          <Line
            isAnimationActive={false}
            legendType="plainline"
            name={t('floor-area.business-area')}
            type="monotone"
            dataKey={BUSINESS_PREMISES}
            stroke="green"
            strokeWidth="2px"
            dot={false}
            yAxisId="left"
          />
          <Line
            isAnimationActive={false}
            legendType="none"
            type="monotone"
            dataKey={BUSINESS_PREMISES+PREDICTION}
            stroke="green"
            strokeDasharray="3 3"
            strokeWidth="2px"
            dot={false}
            yAxisId="left"
          />
           <Line
            isAnimationActive={false}
            legendType="plainline"
            name={t('floor-area.business-area')}
            type="monotone"
            dataKey={OTHER}
            stroke="green"
            strokeWidth="2px"
            dot={false}
            yAxisId="left"
          />
          <Line
            isAnimationActive={false}
            legendType="none"
            type="monotone"
            dataKey={OTHER+PREDICTION}
            stroke="green"
            strokeDasharray="3 3"
            strokeWidth="2px"
            dot={false}
            yAxisId="left"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

FloorAreaChart.propTypes = {
  current: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired
}

const mapDispatchToProps = {
  getProjectsOverview
}

const mapStateToProps = state => {
  return {
   chartData: projectOverviewSelector(state)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FloorAreaChart)
