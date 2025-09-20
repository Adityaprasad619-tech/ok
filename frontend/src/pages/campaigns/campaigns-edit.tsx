import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/campaigns/campaignsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditCampaignsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'title': '',

    'goal_amount': '',

    'raised_amount': '',

    end_date: new Date(),

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { campaigns } = useAppSelector((state) => state.campaigns)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof campaigns === 'object') {
      setInitialValues(campaigns)
    }
  }, [campaigns])

  useEffect(() => {
      if (typeof campaigns === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (campaigns)[el])
          setInitialValues(newInitialVal);
      }
  }, [campaigns])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/campaigns/campaigns-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit campaigns')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit campaigns'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="CampaignTitle"
    >
        <Field
            name="title"
            placeholder="CampaignTitle"
        />
    </FormField>

    <FormField
        label="GoalAmountinSHM"
    >
        <Field
            type="number"
            name="goal_amount"
            placeholder="GoalAmountinSHM"
        />
    </FormField>

    <FormField
        label="RaisedAmountinSHM"
    >
        <Field
            type="number"
            name="raised_amount"
            placeholder="RaisedAmountinSHM"
        />
    </FormField>

      <FormField
          label="EndDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.end_date ?
                  new Date(
                      dayjs(initialValues.end_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'end_date': date})}
          />
      </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/campaigns/campaigns-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditCampaignsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditCampaignsPage
