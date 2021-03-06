#!/bin/bash

#http://tldp.org/LDP/abs/html/ops.html
gcd ()
{
  dividend=$1             
  divisor=$2                                  
  remainder=1 
  until [ "$remainder" -eq 0 ]
  do    
    let "remainder = $dividend % $divisor"
    dividend=$divisor 
    divisor=$remainder
  done    
}     

gcdmany () 
{
  for i in {1..50000}
  do  
    gcd 9876543210987653 87923
  done
}

bigfile ()
{
  curl -s http://cachefly.cachefly.net/100mb.test > 100mb.test
  cat 100mb.test > disk.test
  for i in {1..12}
  do
    cat 100mb.test >> disk.test
  done
}

read provider < prov
read ram < ram
echo "Running tests.."
echo '---------'                                                                                       >results
echo 'Provider'                                                                                        >>results
echo 'arg, should be VPS provider name'                                                                >>results
echo '---'                                                                                             >>results
echo $provider                                                                                         >>results
echo '---------'                                                                                       >>results
echo 'date'                                                                                            >>results
echo 'date'                                                                                            >>results
date                                                                                                   >>results
echo '---'                                                                                             >>results
echo '---------'                                                                                       >>results
echo 'IP address'                                                                                      >>results
echo 'ip addr show eth0 | grep inet'                                                                   >>results
echo '---'                                                                                             >>results
ip addr show eth0 | grep inet                                                                          >>results
echo '---------'                                                                                       >>results
echo 'RAM'                                                                                             >>results
#echo "free -t -m | grep Mem"                                                                          >>results
echo '---'                                                                                             >>results
echo $ram                                                                                              >>results
echo '---------'                                                                                       >>results
echo 'CPU'                                                                                             >>results
echo 'gcdmany()'                                                                                       >>results
echo '---'                                                                                             >>results
GCDST=$(date +%s)
gcdmany
GCDEN=$(date +%s)
GCDELAPSED=$(($GCDEN - $GCDST))
echo $GCDELAPSED seconds                                                                               >>results
echo '---------'                                                                                       >>results
echo 'Network'                                                                                         >>results
echo '(time curl -s http://cachefly.cachefly.net/100mb.test >/dev/null) 2>&1| grep real | cut -f2'     >>results
echo '---'                                                                                             >>results
(time curl -s http://cachefly.cachefly.net/100mb.test >/dev/null) 2>&1| grep real | cut -f2            >>results
echo '---------'                                                                                       >>results
echo 'Disk Transfer'                                                                                   >>results
echo "dd if=disk.test of=ddfile bs=8k count=1 && sync"                                                 >>results
echo '---'                                                                                             >>results
bigfile
DST=$(date +%s)
(dd if=disk.test of=ddfile bs=8k count=157286 2>&1)                                                         >>null
sync 2>&1                                                                                              >>null
DEN=$(date +%s)
DELAPSED=$(($DST - $DEN))
echo $DELAPSED seconds                                                                                 >>results
rm ddfile
rm disk.test
rm 100mb.test
cat results
curl --data-binary @results http://bench.willsave.me/process
rm results
