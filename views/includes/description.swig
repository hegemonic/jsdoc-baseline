{% if description %}
    {{ description|resolveLinks|markdown }}
{% endif %}
