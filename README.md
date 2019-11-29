# MData - Docker image

## Pre-requisites

Docker app for your respective platform

- [Docker][https://docs.docker.com/v17.09/engine/installation/]

For Macs and Unix OS, ensure that the run_mdata.sh has execute permissions

```
$ chmod 744 run_mdata.sh
```

For Windows:

```
<to be defined>
```

## Start MData

To start mdata use the following command:

```
sh mdata_run.sh up
```

If you want to run all the mdata services as a daemon, run below instead:

```
sh mdata_run.sh up -d
```

__Note__: If this the first time, docker will download, Node, Neo4J and Redis images and it might take some time before the entire thing starts up. Subsequent times will be a lot quicker.

You should see in the logs on your console something like below:

```
Starting cache                ... done
Starting mdata-docker_neo4j_1 ... done
Starting mdata-docker_mdata-worker_1 ... done
Starting mdata-docker_mdata-web_1    ... done

```

#### Ensuring all the 4 services for Mdata are up and running

TO confirm all of the 4 services are running, execute the below:

```
docker ps
```

This should display something like below. The `CONTAINER ID` will be different.

```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                        NAMES
831bc254e7ef        node:latest         "docker-entrypoint.s…"   7 minutes ago       Up About a minute   0.0.0.0:3000->3000/tcp                       mdata-docker_mdata-web_1
cc2dbc4425b8        node:latest         "docker-entrypoint.s…"   7 minutes ago       Up About a minute                                                mdata-docker_mdata-worker_1
8935adab5534        neo4j:latest        "/sbin/tini -g -- /d…"   10 minutes ago      Up About a minute   7473/tcp, 7687/tcp, 0.0.0.0:7474->7474/tcp   mdata-docker_neo4j_1
0dba624f3a12        redis               "docker-entrypoint.s…"   10 minutes ago      Up About a minute   6379/tcp                                     cache
```

### Shutting down mData

If you didn't run mdata as a daemon, you can simply kill the process `Ctrl + C` will do the trick in most OS platforms.

IF you started it as a daemon, execute below to shut down:

```
sh run_mdata.sh down
```

