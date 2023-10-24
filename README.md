# get-runner-labels-action

Github Action to get current runner labels. This is mostly useful for self-hosted runners.

## Why?

Github Actions does not provide a way to get the labels for the current runner. 
This action provides a way to get the labels for the current runner.

See [this issue](https://github.com/actions/runner/issues/821) for more information.

**NOTE:** After above issue is resolved, this action will be deprecated.

# Inputs

## `include-org-runners`

By default, this action will include all runners in the organization and all runners in the current repository. 
If you want to limit the runners to only those in the current repository, set this to `false`.
**NOTE**: see [github-token] 

## `github-token`

by default, this action require token with `admin:org` and `self-hosted runners` -scope to get 
all runners in the organization level.

# outputs

## `labels`

A comma separated list of labels for the current runner.

## Usage

```yaml
name: Get runner labels
on: [push]

jobs:
  get-runner-labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
      - uses: embedded-community/get-runner-labels-action@v1
        id: runner-labels
        with:
          github-token: ${{ secrets.MY_TOKEN }}
      - run: echo ${{ steps.runner-labels.outputs.labels }}
```
