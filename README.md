
# Contributions

A tool allowing you to display or build your merged contributions from different services. Currently supported: Github, Gitlab.

![https://chart-studio.plotly.com/~mpellouin/2.jpg](https://chart-studio.plotly.com/~mpellouin/2.jpg)


## Authors

- [@mpellouin](https://www.github.com/mpellouin)


## API Reference

#### Get your contribution data

```http
  GET /contributions?github_id=${github_id}&gitlab_id=${gitlab_id}
```

| Parameter   | Type     | Description                         |
| :---------- | :------- | :---------------------------------- |
| `github_id` | `string` | **Required**. Your github username. |
| `gitlab_id` | `string` | **Required**. Your gitlab username. |

#### Get Heatmap from contribution data (returns URL)

```http
  GET /contributions/heatmap?github_id=${github_id}&gitlab_id=${gitlab_id}
```

| Parameter   | Type     | Description                         |
| :---------- | :------- | :---------------------------------- |
| `github_id` | `string` | **Required**. Your github username. |
| `gitlab_id` | `string` | **Required**. Your gitlab username. |



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GITHUB_TOKEN`: a PAT allowing you to query the Github graphql API. ([know more](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens))

`PLOTLY_USER`: Your plotly username.

`PLOTLY_API_KEY`: Your own plotly api key. ([get it here](https://chart-studio.plotly.com/settings/api#/))


## Run Locally

Clone the project

```bash
  git clone git@github.com:chunk-so/contributions.git
```

Go to the project directory

```bash
  cd contributions
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

